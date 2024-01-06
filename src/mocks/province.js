import { faker } from "@faker-js/faker";

const MAX_DATA = 100;
export default {
    Mst_Province_Create: (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                id: faker.datatype.uuid()
            }),
        );
    },
    Mst_Province_Delete: (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                id: req.params.id
            }),
        );

    },
    Mst_Province_Update: (req, res, ctx) => {
        console.log(req.params.id);
        return res(
            ctx.status(200),
            ctx.json({
                id: req.params.id
            }),
        );
    },
    Mst_Province_Search: (req, res, ctx) => {
        const { url } = req;
        let $top = 10;
        let $skip = 0;
        let $filter = "";
        for (const [key, value] of url.searchParams.entries()) {
            if (key === "$top") {
                $top = parseInt(value);
            } else if (key === "$skip") {
                $skip = parseInt(value);
            } else if (key === "$filter") {
                $filter = value;
            }
        }
        const provinces = Array(MAX_DATA).fill(0).map(() => {
            return {
                id: faker.datatype.uuid(),
                provinceCode: faker.random.alphaNumeric(4, { casing: 'upper' }),
                provinceName: faker.address.cityName(),
                isActive: faker.datatype.boolean()
            };
        });
        return res(
            ctx.status(200),
            ctx.json({
                d: {
                    __count: MAX_DATA,
                    results: provinces.splice($skip, $top)
                }
            }),
        );
    }
};
