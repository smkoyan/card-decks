import { Next, ParameterizedContext } from 'koa';
import schemas from './schemas';


const payloads: {
    [key: string]: any,
} = {
    params: (ctx: ParameterizedContext) => ctx.params,

    query: (ctx: ParameterizedContext) => ctx.query,

    body: (ctx: ParameterizedContext) => ctx.request.body,
};

const middleware = async (ctx: ParameterizedContext, next: Next) => {
    const method = ctx.request.method.toUpperCase();
    const route = ctx._matchedRoute;
    const key = `${method}:${route}`;
    const schema = schemas[key];

    for (const rule in schema) {
        if (!schema.hasOwnProperty(rule)) {
            continue;
        }

        const _schema = schema[rule];
        const payload = payloads[rule](ctx);

        try {
            await _schema.validate(payload)
        } catch (error) {
            ctx.status = 422;
            ctx.body = { errors: error.errors };
            return;
        }
    }

    await next();
};

export default middleware;
