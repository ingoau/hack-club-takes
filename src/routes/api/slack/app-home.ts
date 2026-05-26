const main = [
	{
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: 'view takes at hctakes.ingo.au'
		}
	}
];

const admin = [
	{
		type: 'header',
		text: {
			type: 'plain_text',
			text: 'admin dashboard',
			emoji: true
		},
		level: 1
	},
	{
		type: 'context',
		elements: [
			{
				type: 'plain_text',
				text: 'i will hack this club',
				emoji: true
			}
		]
	},
	{
		type: 'input',
		element: {
			type: 'plain_text_input',
			action_id: 'plain_text_input-action'
		},
		label: {
			type: 'plain_text',
			text: 'take timestamp, link, etc',
			emoji: true
		},
		optional: false
	},
	{
		type: 'actions',
		elements: [
			{
				type: 'button',
				text: {
					type: 'plain_text',
					text: 'hide',
					emoji: true
				},
				value: 'hide',
				action_id: 'hide'
			},
			{
				type: 'button',
				text: {
					type: 'plain_text',
					text: 'show',
					emoji: true
				},
				value: 'show',
				action_id: 'show'
			},
			{
				type: 'button',
				text: {
					type: 'plain_text',
					text: 'sync',
					emoji: true
				},
				value: 'sync',
				action_id: 'sync'
			}
		]
	}
];
