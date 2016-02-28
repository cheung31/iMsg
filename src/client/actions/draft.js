
import { createAction } from 'redux-actions'
import { browserHistory } from 'react-router'
import * as ConversationActions from './conversations'
import App from '../containers/App'

export const addRecipient = createAction('add recipient')
export const removeRecipient = createAction('remove recipient')
export const addMessageBody = createAction('add message body')
export const clearDraft = createAction('new draft')

export function sendDraft(body) {
    return function (dispatch, getState) {
        const { draft, profile, conversations } = getState()

        // Create message record
        var messageId = 'messages/' + App.ds.getUid()
        var messageRecord = App.ds.record.getRecord(messageId)
        var authorId = 'users/' + profile.username
        var messageObj = {
            id: messageId,
            author: authorId,
            body: body,
            time: Date.now()
        }
        messageRecord.set(messageObj)

        // Create conversation record
        var participants = [...draft.recipients, authorId].sort()
        var conversationId = 'conversations/' + new Buffer(JSON.stringify(participants)).toString('base64')
        var existingConversation = conversations.conversationsById[conversationId]
        var conversationRecord = App.ds.record.getRecord(conversationId) 
        var conversationObj = {
            id: conversationId,
            participants: participants,
            lastMessage: body
        }
        // If new conversation, assign message array
        conversationObj.messages = [messageId]
        // Otherwise, append messageId
        conversationRecord.set(conversationObj)

        // Add conversation to participant conv lists
        for (let index in participants) {
            var listId = participants[index] + '/conversations'
            var participantConversationList = App.ds.record.getList(listId)
            participantConversationList.whenReady(function () {
                var entries = participantConversationList.getEntries()
                if (entries.indexOf(conversationId) == -1) {
                    debugger;
                    participantConversationList.addEntry(conversationId)
                }
            })
        }

        // Add conversation to store
        if (!conversations.conversationsById.hasOwnProperty(conversationId)) {
            dispatch(ConversationActions.addConversation({
                id: conversationId,
                participants: participants,
                lastMessage: body
            }))
        }

        // Add message to store
        dispatch(ConversationActions.addMessage(Object.assign({
            conversationId: conversationId
        }, messageObj )))

        // If new conversation, navigate to conversation
        browserHistory.push('/' + conversationId)

        //dispatch(clearDraft())
    }
}
