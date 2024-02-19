const client = require("..");
const config = require("../config.json")
const Discord = require("discord.js")

const { roleId, channelId } = config.info

client.on("interactionCreate", async(interaction) => {
    if(interaction.isButton()) {
        if (interaction.customId === "verificar") {
            const role = interaction.guild.roles.cache.get(roleId)
            const channel = interaction.guild.channels.cache.get(channelId)

            if(client.guilds.cache.get(interaction.guildId).members.cache.get(client.user.id).roles.highest.comparePositionTo(role) <= 0) return interaction.reply({ content: "Eu não tenho permissão para te dar o cargo, contate os administradores do servidor!", ephemeral: true })
            if(interaction.guild.members.cache.get(`${interaction.user.id}`).roles.cache.has(role.id)) return interaction.reply({ content: ":x: Você já possui o cargo de verificado!", ephemeral: true })

            try {
                interaction.member.roles.add(role)

                interaction.reply({
                    content: "Você foi verificado!", ephemeral: true
                })

                const embedLogs = new Discord.EmbedBuilder()
                .setTitle(`Sistema de logs | ${config.embed.title}`)
                .setThumbnail(interaction.user.avatarURL({ dynamic: true }) || client.user.avatarURL() || interaction.guild.iconURL())
                .setDescription(`
                :rocket: O ususario ${interaction.user} (${interaction.user.id}), foi verificado com sucesso, se isso for um erro, use botão "Revogar Acesso" abaixo!

                **Informações:**
                > :timer: Verificado <t:${Math.floor(Date.now() / 1000)}:R>
                > :identification_card: Conta criada <t:${Math.floor(interaction.user.createdAt.getTime() / 1000)}:R>
                > 🔒 Acesso revogado: Falso
                `)
                .setColor(config.embed.color)
                .setFooter({ text: interaction.user.id })

                const row = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("revogar")
                    .setLabel("Revogar Acesso")
                    .setEmoji("🔒")
                    .setStyle(Discord.ButtonStyle.Danger)
                )

                channel.send({
                    embeds: [embedLogs],
                    components: [row]
                })

            } catch (error) {
                interaction.reply({
                    content: "Algo deu errado ao tentar te dar o cargo, por favor fale com um administrador",
                    ephemeral: true
                })

                console.log(error)
            }
        } else if (interaction.customId === "revogar") {
            const memberId = interaction.message.embeds[0].footer.text
            const member = interaction.guild.members.cache.get(memberId)

            try {
                const role = interaction.guild.roles.cache.get(roleId)
                member.roles.remove(role)

                const embedLogsNew = new Discord.EmbedBuilder()
                .setTitle(`Sistema de logs | ${config.embed.title} | Revogado`)
                .setThumbnail(interaction.user.avatarURL({ dynamic: true }) || client.user.avatarURL() || interaction.guild.iconURL())
                .setDescription(`
                :rocket: O acesso do ususario ${interaction.user} (${interaction.user.id}), foi revogado com sucesso, por ${interaction.user}!

                **Informações:**
                > :timer: Revogado <t:${Math.floor(Date.now() / 1000)}:R>
                > :identification_card: Conta criada <t:${Math.floor(interaction.user.createdAt.getTime() / 1000)}:R>
                > 🔒 Acesso revogado: Verdadeiro
                `)
                .setColor("DarkRed")
                .setFooter({ text: interaction.user.id })

                const rowNew = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("revogar")
                    .setLabel("Revogar Acesso")
                    .setDisabled(true)
                    .setStyle(Discord.ButtonStyle.Danger)
                )

                interaction.update({
                    embeds: [embedLogsNew],
                    components: [rowNew]
                })

                interaction.channel.send({
                    content: `${interaction.user} O acesso do usuario foi revogado com sucesso!`,
                }).then((message) => {
                    setTimeout(() => {
                        message.delete()
                    }, 10000);
                })

                member.send(`O seu acesso no servidor **${interaction.guild.name}** foi revogado por ${interaction.user}`)

            } catch (error) {
                interaction.reply({
                    content: "Algo deu errado ao tentar remover o cargo, tente novamente!",
                    ephemeral: true
                })

                console.log(error)
            }
        }
    }
})