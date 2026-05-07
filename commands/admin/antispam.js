/**
 * Feature: Anti-Spam System
 * System: TOM PRIME X
 * Author: ToxRon
 */

const spamTracker = new Map();

module.exports = {
    name: 'antispam',
    category: 'admin',
    async execute(sock, msg, { from, sender, isGroup, isBotAdmin }) {
        try {
            // 1. Group Context Check
            if (!isGroup) {
                return sock.sendMessage(from, { 
                    text: '*[ ᴇʀʀᴏʀ ]* ᴛʜɪs sʏsᴛᴇᴍ ɪs ᴏɴʟʏ ғᴏʀ ɢʀᴏᴜᴘs.' 
                });
            }

            // 2. Tracking Logic
            const now = Date.now();
            const userState = spamTracker.get(sender) || { count: 0, lastTime: 0 };
            
            // Check if messages sent within 3 seconds
            if (now - userState.lastTime < 3000) {
                userState.count++;
            } else {
                userState.count = 1;
            }
            
            userState.lastTime = now;
            spamTracker.set(sender, userState);

            // 3. Execution (Kick if count reaches 5)
            if (userState.count >= 5) {
                if (!isBotAdmin) {
                    return sock.sendMessage(from, { 
                        text: '*[ ɪɴғᴏ ]* sᴘᴀᴍ ᴅᴇᴛᴇᴄᴛᴇᴅ. ᴇʟᴇᴠᴀᴛᴇ ʙᴏᴛ ᴛᴏ ᴀᴅᴍɪɴ ᴛᴏ ᴛᴀᴋᴇ ᴀᴄᴛɪᴏɴ.' 
                    });
                }

                // Instant Notification & Kick
                await sock.sendMessage(from, { 
                    text: `*⚠️ sᴘᴀᴍ ᴅᴇᴛᴇᴄᴛᴇᴅ!*\n\n*ᴜsᴇʀ:* @${sender.split('@')[0]}\n*ᴀᴄᴛɪᴏɴ:* ɪɴsᴛᴀɴᴛ ᴋɪᴄᴋ\n*sʏsᴛᴇᴍ:* ᴛᴏᴍ ᴘʀɪᴍᴇ x`, 
                    mentions: [sender] 
                });
                
                await sock.groupParticipantsUpdate(from, [sender], 'remove');
                
                // Reset tracker for this user
                spamTracker.delete(sender);
            }
        } catch (err) {
            console.error('[ANTISPAM ERROR]', err);
        }
    }
};
