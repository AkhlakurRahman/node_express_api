import { Code } from '../enums/code.enum';
import { Status } from '../enums/status.enum';

export class HttpResponse {
	private timestamp: string;

	constructor(
		private statusCode: Code,
		private httpStatus: Status,
		private message: string,
		private data?: {}
	) {
		this.timestamp = new Date().toDateString();
		this.statusCode = statusCode;
		this.httpStatus = httpStatus;
		this.message = message;
		this.data = data;
	}
}
