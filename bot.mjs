import { Client, IntentsBitField, TextChannel } from "discord.js";

import * as dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
const tokenGPT = process.env.TOKENOPENAI

const cliente = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

const openai = new OpenAI({
  apiKey: tokenGPT,
});


const fotosBB= [
  "https://i.gifer.com/FNm.gif",
  "https://i.gifer.com/34G4.gif",
  "https://i.gifer.com/Z6d5.gif"
]




cliente.on('messageCreate', async message => {
  if (message.author.bot) return;
  
  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === '$breakingbad') {
    if (fotosBB.length === 0) {
      message.reply('Desculpe, não há imagens disponíveis no momento.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * fotosBB.length);
    const randomImage = fotosBB[randomIndex];


    try {
      // Envia a imagem no canal
      
      message.channel.send({
         files: [{
          attachment:randomImage,
          name:"BreakingBad.gif"
        }] 
      });
      const log = `Comando "${command}" executado por ${message.author.tag} no servidor "${message.guild.name}" (${message.guild.id}) no canal "${message.channel.name}" (${message.channel.id})`;
      const userid = '1158357229876031499';
      const user = await cliente.users.fetch(userid);
      await user.send(log);
    } catch (error) {
      console.error('Erro ao enviar a imagem:', error);
      message.reply('Ocorreu um erro ao enviar a imagem de Breaking Bad.');
    }
  }
});




cliente.once('ready', async () => {
  console.log(`Logged in as ${cliente.user.tag}!`);
  console.log('Servidores (Guilds):');
  cliente.guilds.cache.forEach(guild => {
    console.log(`- ${guild.name} (ID: ${guild.id})`);
  });
});


cliente.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;

    const userMessage = message.content.substring(1).trim();
    let conversationLog= [
      {
        role: 'system',
        content: 'você se chama isaac pedron, tem 13 anos e só fala sobre as coisas relacionadas a xadrez, sport club internacional, caxias do sul, futebol e também sobre curiosidades suas, você falara com palavras bem dificeis, e sempre colocando um emoji de vinho no final de cada frase.'
      }
    ]

    try {
      let prevMessages = await message.channel.messages.fetch({limit: 15});
      prevMessages.reverse();

      prevMessages.forEach((msg)=>{
        conversationLog.push({
          role:'user',
          content: msg.content,
        });
      });

      const response = await openai.chat.completions.create({
        model:'gpt-3.5-turbo',
        messages:conversationLog,
        max_tokens : 256,
        temperature : 0,
        top_p : 1,
        frequency_penalty : 0,
        presence_penalty : 0
      })
      
      .catch((error)=>{
        console.error("deu erro",error)
      });

      const log = `Comando "${userMessage}" executado por ${message.author.tag}(${message.author.id}) no servidor "${message.guild.name}" (${message.guild.id}) no canal "${message.channel.name}" (${message.channel.id}),Resposta do GPT:${response.choices[0].message.content}`
      console.log(log);
      const userid = '1158357229876031499';
      const user = await cliente.users.fetch(userid);
      await user.send(log);
      
      message.reply(response.choices[0].message.content);

  
    } catch (error) {
      console.error('Erro ao chamar o GPT-3:', error.response?.data?.error || error.message);
    }
});

cliente.login(process.env.TOKENDISCORD);
