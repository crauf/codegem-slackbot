module.exports = {
  checkin: () => {
    return {
      blocks: JSON.stringify([
        {
          type: "image",
          image_url:
            "https://cdn.glitch.global/984e1284-8584-4530-860e-e4f2af2ba7df/download.jpg?v=1643572443706",
          alt_text: "marg",
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: "Complete check-in",
              },
              style: "primary",
              value: "complete_check_in",
            },
          ],
        },
      ]),
    };
  },
  confirmation: (context) => {
    return {
      channel: context.channel_id,
      text: `${context.user_name}'s Daily Standup`,
      blocks: JSON.stringify([
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${context.user_name}'s Daily Standup*`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*What did you work on yesterday?*\n${context.yesterday_report}\n\n*What are you working on today?*\n${context.today_report}\n\n*Are you blocked on anything?*\n${context.blocked_report}`,
          },
        },
      ]),
    };
  },
  modal: (context) => {
    return {
      trigger_id: context.trigger_id,
      view: JSON.stringify({
        type: "modal",
        title: {
          type: "plain_text",
          text: "Daily Standup",
        },
        callback_id: "submit-ticket",
        submit: {
          type: "plain_text",
          text: "Done",
        },
        blocks: [
          {
            block_id: "yesterday_block",
            type: "input",
            label: {
              type: "plain_text",
              text: "What did you work on yesterday?",
            },
            element: {
              action_id: "description",
              type: "plain_text_input",
              multiline: true,
            },
          },
          {
            block_id: "today_block",
            type: "input",
            label: {
              type: "plain_text",
              text: "What are you working on today?",
            },
            element: {
              action_id: "today",
              type: "static_select",
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Frontend UI development",
                  },
                  value: "ui",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Frontend API integration",
                  },
                  value: "integration",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Backend API development",
                  },
                  value: "api",
                },
              ],
            },
          },
          {
            block_id: "blocked_block",
            type: "input",
            label: {
              type: "plain_text",
              text: "Are you blocked on anything?",
            },
            element: {
              action_id: "blocked",
              type: "static_select",
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Nothing",
                  },
                  value: "no",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "I have something to discuss with PM",
                  },
                  value: "yes",
                },
              ],
            },
          },
        ],
      }),
    };
  },
};
