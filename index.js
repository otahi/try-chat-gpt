const dotenv = require('dotenv');
const cac = require('cac');
const axios = require('axios');

/*
curl https://api.openai.com/v1/chat/completions
  -H "Authorization: Bearer $OPENAI_API_KEY"
  -H "Content-Type: application/json"
  -d '{
  "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "What is the OpenAI mission?"}]
}'
*/
dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


(async() => {
    process.on("SIGINT", () => { process.exit(0); });

    const cli = cac();
    cli
        .command('[...messages]', 'input message')
        .action((messages, options) => {
            run(messages, options);
        });

    cli.help();
    cli.parse();

})();


function run(messages, options) {
    const headers = {
        headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        }
    };

    axios.post('https://api.openai.com/v1/chat/completions', {
            "model": "gpt-3.5-turbo",
            "messages": [{ "role": "user", "content": messages.join(", ") }]
        }, headers)
        .then((response) => {
            for (const choice of response.data.choices) {
                console.log(choice.message.content);
            }
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {});
}