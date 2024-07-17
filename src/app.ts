import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import ip from 'ip';
import { Code } from './enums/code.enum';
import { HttpResponse } from './utils/response';
import { Status } from './enums/status.enum';
import patientRoutes from './routes/patients.routes';

export class App {
	private readonly app: Application;
	private readonly SUCCESS_TEXT = 'This application is running on: ';
	private readonly ROUTE_NOT_FOUND = 'You came to the wrong place. Go back';

	constructor(
		private readonly port: string | number = process.env.SERVER_PORT || 3000
	) {
		this.app = express();
		this.middleWare();
		this.routes();
	}

	/**
	 * Listening to the port on which the application is running
	 * @param
	 * @return void
	 */

	listen(): void {
		this.app.listen(this.port);
		console.info(`${this.SUCCESS_TEXT} ${ip.address()}:${this.port}`);
	}

	/**
	 * Setting up middlewares
	 * @param
	 * @return void
	 */

	private middleWare(): void {
		this.app.use(cors({ origin: '*' }));
		this.app.use(express.json());
	}

	/**
	 * Setting up routes
	 * @param
	 * @return void
	 */

	private routes(): void {
		this.app.use('/patients', patientRoutes);

		this.app.get('/', (req: Request, res: Response) =>
			res
				.status(Code.OK)
				.send(
					new HttpResponse(
						Code.OK,
						Status.OK,
						'Welcome to the patients API'
					)
				)
		);

		this.app.all('*', (req: Request, res: Response) =>
			res
				.status(Code.NOT_FOUND)
				.send(
					new HttpResponse(
						Code.NOT_FOUND,
						Status.NOT_FOUND,
						this.ROUTE_NOT_FOUND
					)
				)
		);
	}
}
