require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ticket = require("./ticket");
const signature = require("./verifySignature");
const api = require("./api");
const payloads = require("./payloads");
const debug = require("debug")("slash-command-template:index");

const app = express();

/*
 * Parse application/x-www-form-urlencoded && application/json
 * Use body-parser's `verify` callback to export a parsed raw body
 * that you need to use to verify the signature
 */

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

app.get("/", (req, res) => {
  res.send(
    "<h2>The Slash Command and Dialog app is running</h2> <p>Follow the" +
      " instructions in the README to configure the Slack App and your environment variables.</p>"
  );
});

/*
 * Endpoint to receive /codegem slash command from Slack.
 * Checks verification token and opens a dialog to capture more info.
 */
app.post("/command", async (req, res) => {
  // Verify the signing secret
  if (!signature.isVerified(req)) {
    debug("Verification token mismatch");
    return res.status(404).send();
  }

  const message = payloads.checkin();
  res.send(message);
});

/*
 * Endpoint to receive the check-in action and dialog submission. Checks the verification token
 * and creates a codegem tickets
 */
app.post("/interactive", async (req, res) => {
  // Verify the signing secret
  if (!signature.isVerified(req)) {
    debug("Verification token mismatch");
    return res.status(404).send();
  }

  const body = JSON.parse(req.body.payload);
  let result = null;
  const { trigger_id } = body;
  switch (body.type) {
    case "block_actions":
      let view = payloads.modal({
        trigger_id,
      });

      result = await api.callAPIMethod("views.open", view);
      break;
    case "view_submission":
      ticket.create(body.user.id, body.view.state.values);
      break;
    default:
      break;
  }

  debug("views.open: %o", result);
  return res.send("");
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    server.address().port,
    app.settings.env
  );
});
