import app from '@/app';
import { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './openapi.json';

const swaggerDocs = (app: Express) => {
    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customCss: '.swagger-ui > .topbar{display:none}',
        })
    );
};

app.get('/openapi.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

export default swaggerDocs;
