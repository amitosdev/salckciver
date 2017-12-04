'use strict'
const _ = require('lodash')
const moment = require('moment')

// todo: written as a POC. will be refactored and tested.
module.exports = (reqData) => {
	let message = {
		pretext: `/${reqData.httpMethod} request received`,
		author_name: `${uaToString(reqData.userAgent)}`,
		fields: [],
		footer: 'Slackciver',
		ts: moment(reqData.requestTime, 'DD/MMM/YYYY:HH:mm:ss').unix()
	}

	if (reqData.sourceIp) {
		message.fields.push(getField('Request IP', [reqData.sourceIp]))
	}

	if (reqData.body) {
		let body = getBodyString(reqData.body)
		message.fields.push(getField('Payload', body))
	}

	if (reqData.queryStringParameters) {
		let qs = objToArrayOfStrings(reqData.queryStringParameters)
		message.fields.push(getField('Query String Parameters', qs))
	}

	return message
}

function objToArrayOfStrings(obj) {
	let result = []
	_.forEach(obj, (value, key) => {
		result.push(`${key} = ${JSON.stringify(value)}`)
	})
	return result
}

function getField(title, valuesArr) {
	let value = ''
	for (let i = 0; i < valuesArr.length; i++) {
		value += valuesArr[i] + '\n '
	}
	return {
		title,
		value,
		short: false
	}
}

function uaToString(uaObj) {
	let result = ''
	if (uaObj.browser && uaObj.browser.name) {
		result += `Browser: ${uaObj.browser.name} v${uaObj.browser.version} | `
	}

	if (uaObj.engine && uaObj.engine.name) {
		result += `Engine: ${uaObj.engine.name} v${uaObj.engine.version} | `
	}

	if (uaObj.os && uaObj.os.name) {
		result += `OS: ${uaObj.os.name} v${uaObj.os.version} | `
	}

	if (uaObj.device && uaObj.device.name) {
		result += `Device: ${uaObj.device.name} v${uaObj.device.version} | `
	}

	if (!result) {
		result = uaObj.ua
	} else if (result[result.length - 2] === '|') {
		result = result.slice(0, -2)
	}

	return result
}

function getBodyString(value) {
	if (_.isObject(value)) return objToArrayOfStrings(value)
	let result
	try {
		result = JSON.parse(value)
		return objToArrayOfStrings(result)
	} catch (e) {
		result = [value]
	}
	return result
}
