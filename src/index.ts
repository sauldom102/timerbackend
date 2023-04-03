import * as dotenv from 'dotenv';
import app from './app';
import swaggerDocs from './swagger';
import env from '@/env';

dotenv.config();

const port = env.PORT || 3001;

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);

    swaggerDocs(app);
});
