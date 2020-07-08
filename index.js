const Discord = require('discord.js');
const aliyeSov = require('./kufur.json')

const client = new Discord.Client()

const prefix = process.env.prefix //"!söv"
const prefix_2 = process.env.prefix_2 //"!score"
const prefix_3 = process.env.prefix_3 //"!totalscore"


let items = []
let duoSovus = []


let baseText = `\`\`\`\n|\t\tPlayer\t\t|\t\tScore\t\t|\`\`\``
let resetText = baseText;


let baseTextDuo = `\`\`\`\n|\t\tSlayer\t\t|\t\tVictim\t\t| Score |\`\`\``
let resetTextDuo = baseTextDuo;


// Ali Söv Start
function aliyeKufur() {
    newRandom = Math.floor(Math.random() * 35)
    return aliyeSov[newRandom]
}

function calculateScore(sentence) {
    let noSpace = sentence.replace(/ /g, "")
    return noSpace.length;
}


function sortByProperty(property){  
    return function(a,b){  
       if(a[property] < b[property])  
          return 1;  
       else if(a[property] > b[property])  
          return -1;  
   
       return 0;  
    }  
}
// Ali Söv End


// Discord JS
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})


client.on("message", msg => {
    try {
        if (msg.content.startsWith(prefix)) {
            const user = msg.author;
    
            let newKufur = aliyeKufur();
            let newScore = calculateScore(newKufur);
            
            let toWhoId = msg.mentions.users.keys().next().value;
            let toWhoUsername = msg.mentions.users.get(toWhoId)["username"]
    
            if (duoSovus.some((item => (item.slayer === user.username && item.victim === toWhoUsername)))) {
                let playerIndex = duoSovus.findIndex(item => item.slayer === user.username);
                let playerIndexTotal = items.findIndex(item => item.slayer === user.username);      
                
                duoSovus[playerIndex]["score"] += newScore
                items[playerIndexTotal]["score"] += newScore
    
                msg.channel.send(newKufur + `\t<@${toWhoId}>\n` + 
                                + newScore + ` puan daha alarak puanını ${duoSovus[playerIndex]["score"]} yaptın.` +`tebrikler :tada: \t<@${user.id}>`)
            } else if (items.some(item => item.slayer === user.username)) {
                let playerIndexTotal = items.findIndex(item => item.slayer === user.username);
                items[playerIndexTotal]["score"] += newScore
                
                duoSovus.push({slayer: user.username, victim: toWhoUsername, score: newScore})
                
                msg.channel.send(newKufur + `\t<@${toWhoId}>\n` + 
                                + newScore + ` puan daha alarak puanını ${items[playerIndexTotal]["score"]} yaptın.` +`tebrikler :tada: \t<@${user.id}>`)
            } else {
                msg.channel.send(newKufur + `\t<@${toWhoId}>\n` + 
                                + newScore + ` puan aldın \t<@${user.id}>, tebrikler :tada: . Sövmeye devam`)
                duoSovus.push({slayer: user.username, victim: toWhoUsername, score: newScore})
                items.push({slayer: user.username, score: newScore})
            }
        }  else if (msg.content === prefix_2) {
            if (duoSovus.length !== 0) {
                sorted_scoreTable = duoSovus.sort(sortByProperty("score"));
                for (let index = 0; index < sorted_scoreTable.length; index++) {
                    baseTextDuo += `\`\`\`\n${index+1}.\t ${sorted_scoreTable[index]["slayer"]}\t\t  ${sorted_scoreTable[index]["victim"]}\t\t\t${sorted_scoreTable[index]["score"]}\n\`\`\``
                }
                msg.channel.send(baseTextDuo);
                baseTextDuo = resetTextDuo;
            } else {
                msg.channel.send("Scoreboard boş")
            }
        } else if (msg.content === prefix_3) {
            if (items.length !== 0) {
                total_scoreTable = items.sort(sortByProperty("score"));
                for (let index = 0; index < total_scoreTable.length; index++) {
                    baseText += `\`\`\`\n${index+1}.\t ${total_scoreTable[index]["slayer"]}\t\t\t\t${total_scoreTable[index]["score"]}\n\`\`\``
                }
                msg.channel.send(baseText)
                baseText = resetText
            } else {
                msg.channel.send("Scoreboard boş")
            }
        } else if (msg.content === "!resetScoreTable") {
            duoSovus = []
            items = []
        }
    } catch (error) {
        if (error instanceof TypeError) {
            msg.channel.send("Boşa kurşun sıkıldı :gun:")
        }
    }
})

client.login(process.env.TOKEN);