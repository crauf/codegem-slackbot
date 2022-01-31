const debug = require("debug")("slash-command-template:ticket");
const api = require("./api");
const payloads = require("./payloads");

/*
 *  Send ticket creation confirmation via
 *  chat.postMessage to the user who created it
 */
const sendConfirmation = async (ticket) => {
  // open a DM channel for that user
  const channel = await api.callAPIMethod("conversations.open", {
    users: ticket.userId,
  });

  const interactMessage = payloads.confirmation({
    channel_id: channel.channel.id,
    user_name: ticket.userName,
    yesterday_report: ticket.yesterdayReport,
    today_report: ticket.todayReport,
    blocked_report: ticket.blockedReport,
  });

  const result = await api.callAPIMethod("chat.postMessage", interactMessage);
  debug("sendConfirmation: %o", result);
};

// Create codegem ticket. Call users.find to get the user's name
// from their user ID
const create = async (userId, values) => {
  const userInfo = await api.callAPIMethod("users.info", {
    user: userId,
  });

  await sendConfirmation({
    userId,
    userName: userInfo.user.profile.real_name,
    yesterdayReport: values.yesterday_block.description.value,
    todayReport: values.today_block.today.selected_option.text.text,
    blockedReport: values.blocked_block.blocked.selected_option.text.text,
  });
};

module.exports = { create, sendConfirmation };
