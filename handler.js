'use strict'
const WebClient = require('@slack/client').WebClient
const uaParser = require('ua-parser-js')
const attachmentBuilder = require('./attachmentsBuilder')

const lambdaResponse = {
	statusCode: 200
}

module.exports.sendToSlack = (event, context, callback) => {
	console.log('called with: ', event)

	let requestData = {
		topic: event.pathParameters.topic,
		httpMethod: event.httpMethod,
		queryStringParameters: event.queryStringParameters,
		requestTime: event.requestContext.requestTime,
		sourceIp: event.requestContext.identity.sourceIp,
		body: event.body,
		userAgent: uaParser(event.headers['User-Agent'])
	}

	let att = attachmentBuilder(requestData)
	console.log('message to send: ', att)

	let channelName = event.pathParameters.channelName

	const token = process.env.SLACK_API_TOKEN
	let web = new WebClient(token)

	web.chat.postMessage(channelName, '', {
		'attachments': JSON.stringify([att])
	}, (err, response) => {
		if (err) console.log('error posting message to slack: ', err)
		callback(null, lambdaResponse)
	})
}

