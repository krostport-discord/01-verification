const embedConfig = require("../../config.json")
const Discord = require("discord.js")


module.exports = {
    name: "setup",
    description: "Envie a embed de verificação para um canal",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async(interaction, client) => {
        const { title, description, image, color } = embedConfig.embed
        const { label, emoji } = embedConfig.button
        
        const embed = new Discord.EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setImage(image)
        .setColor(color)

        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("verificar")
            .setEmoji(emoji)
            .setLabel(label)
            .setStyle(Discord.ButtonStyle.Secondary)
        )

        interaction.reply({
            embeds: [embed],
            components: [row]
        })
    }
}