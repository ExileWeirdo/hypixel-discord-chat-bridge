const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const { formatNumber, formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");

class ClassCalculatorCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "ClassCalculator";
    this.aliases = ["class", "dungeons"];
    this.description = "Calculator for next class level on specified class";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
        username = this.getArgs(message)[2] || username;
        let playerClass = this.getArgs(message)[0].toLowerCase();
        let targetLevel = parseInt(this.getArgs(message)[1], 10);


        const data = await getLatestProfile(username);
  
        username = formatUsername(username, data.profileData?.game_mode);
  
        const dungeons = getDungeons(data.playerRes, data.profile);

        const xpTable = [
            { level: 1, totalXP: 50},
            { level: 2, totalXP: 125 },
            { level: 3, totalXP: 235 },
            { level: 4, totalXP: 395 },
            { level: 5, totalXP: 625 },
            { level: 6, totalXP: 955 },
            { level: 7, totalXP: 1425 },
            { level: 8, totalXP: 2095 },
            { level: 9, totalXP: 3045 },
            { level: 10, totalXP: 4385 },
            { level: 11, totalXP: 6275},
            { level: 12, totalXP: 8940 },
            { level: 13, totalXP: 12700 },
            { level: 14, totalXP: 17960 },
            { level: 15, totalXP: 25340 },
            { level: 16, totalXP: 35640 },
            { level: 17, totalXP: 50040 },
            { level: 18, totalXP: 70040 },
            { level: 19, totalXP: 97640 },
            { level: 20, totalXP: 135640 },
            { level: 21, totalXP: 188140 },
            { level: 22, totalXP: 259640 },
            { level: 23, totalXP: 356640 },
            { level: 24, totalXP: 488640 },
            { level: 25, totalXP: 668640 },
            { level: 26, totalXP: 911640 },
            { level: 27, totalXP: 1239640 },
            { level: 28, totalXP: 1684640 },
            { level: 29, totalXP: 2284640 },
            { level: 30, totalXP: 3084640 },
            { level: 31, totalXP: 4149640 },
            { level: 32, totalXP: 5559640 },
            { level: 33, totalXP: 7459640 },
            { level: 34, totalXP: 9959640 },
            { level: 35, totalXP: 13259640 },
            { level: 36, totalXP: 17559640 },
            { level: 37, totalXP: 23159640 },
            { level: 38, totalXP: 30359640 },
            { level: 39, totalXP: 39559640 },
            { level: 40, totalXP: 51559640 },
            { level: 41, totalXP: 66559640 },
            { level: 42, totalXP: 85559640 },
            { level: 43, totalXP: 109559640 },
            { level: 44, totalXP: 139559640 },
            { level: 45, totalXP: 177559640 },
            { level: 46, totalXP: 225559640 },
            { level: 47, totalXP: 285559640 },
            { level: 48, totalXP: 360559640 },
            { level: 49, totalXP: 453559640 },
            { level: 50, totalXP: 569809640 },
        ];

        function CalculateXPNeeded(finalLevel) {
        const totalXPNeeded = xpTable[finalLevel];
        const currentXP = dungeons.classes.playerClass.totalXp
        const xpNeeded = totalXPNeeded - currentXP;
        return xpNeeded;
        };

        const xpNeeded = CalculateXPNeeded(targetLevel)
        const m7RunsTotal = dungeons.catacombs.MASTER_MODE_FLOORS[7].completions
        var m7runXpBase = 153802;
        
        function CalculateM7RunsNeeded(totalXpNeeded, m7RunsTotal) {
        var boostPercentage = 0;
        if (m7RunsTotal <= 26){
            boostPercentage += 2*(m7RunsTotal - 1);
        }
        else {
            boostPercentage += 50;
        }

        // assuming person has scarf's grimoire
        boostPercentage += 6;
        
        // assuming person has the 10% perk from essense shop
        boostPercentage += 10;

        var xpPerRun = m7runXpBase * (boostPercentage / 100);
        var runsNeeded = math.round(totalXpNeeded / xpPerRun);
        return runsNeeded;
        }
        this.send(`/gc ${username} needs ${runsNeeded} runs of M7 till ${playerClass}${targetLevel}`)
  
        console.log(dungeons)
        if (dungeons == null) {
            // eslint-disable-next-line no-throw-literal
            throw `${username} has never played dungeons on ${data.profileData.cute_name}.`;
          }
    } catch (error) {
      console.log(error);

      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = ClassCalculator;