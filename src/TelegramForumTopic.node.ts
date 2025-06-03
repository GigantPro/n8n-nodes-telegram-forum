import { IExecuteFunctions } from 'n8n-workflow';


import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class TelegramForumTopic implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Telegram: Create Forum Topic',
		name: 'telegramForumTopic',
		group: ['transform'],
		version: 1,
		description: 'Создаёт новый топик-форум в супергруппе Telegram через Bot API',
		defaults: {
			name: 'Telegram Forum Topic',
			color: '#00AECB',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'telegramApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				default: '',
				placeholder: 'e.g. -1001234567890',
				required: true,
				description: 'Идентификатор супергруппы, где создаётся топик',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: true,
				description: 'Заголовок нового форума-топика (не может быть пустым)',
			},
			{
				displayName: 'Icon Custom Emoji ID',
				name: 'iconCustomEmojiId',
				type: 'string',
				default: '',
				required: false,
				description: 'ID кастомного emoji для иконки топика (если нужно)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('telegramApi');
		if (!credentials || !credentials.botToken) {
			throw new NodeOperationError(this.getNode(), 'Не удалось получить Bot Token из Telegram Credentials');
		}
		const botToken = credentials.botToken as string;

		for (let i = 0; i < items.length; i++) {
			const chatId = this.getNodeParameter('chatId', i) as string;
			const title = this.getNodeParameter('title', i) as string;
			const iconCustomEmojiId = this.getNodeParameter('iconCustomEmojiId', i) as string;

			const body: any = {
				chat_id: chatId,
				title,
			};
			if (iconCustomEmojiId !== '') {
				body.icon_custom_emoji_id = iconCustomEmojiId;
			}

			let responseData;
			try {
				responseData = await this.helpers.request({
					method: 'POST',
					uri: `https://api.telegram.org/bot${botToken}/createForumTopic`,
					body,
					json: true,
				});
			} catch (error: any) {
				throw new NodeOperationError(
					this.getNode(),
					`Ошибка при вызове createForumTopic: ${error.message}`,
				);
			}

			returnData.push({
				json: responseData,
			});
		}

		return [returnData];
	}
}
