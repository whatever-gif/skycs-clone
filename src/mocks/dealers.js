import { faker } from "@faker-js/faker";
const MAX_DATA = 100;
export default {
    createDealer: (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                id: faker.datatype.uuid()
            }),
        );
    },
    Mst_Dealer_Delete: (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                id: req.params.id
            }),
        );

    },
    Mst_Dealer_Update: (req, res, ctx) => {
        console.log(req.params.id);
        return res(
            ctx.status(200),
            ctx.json({
                id: req.params.id
            }),
        );
    },
    getAllDealers: (req, res, ctx) => {
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
        const dealers = Array(MAX_DATA).fill(0).map(() => {
            return {
                id: faker.datatype.uuid(),
                dealerCode: faker.random.alphaNumeric(4, { casing: 'upper' }),
                cityCode: faker.random.alpha({ casing: 'upper', count: 2 }),
                dealerName: faker.name.firstName(),
                size: faker.datatype.number({ min: 0, max: 10 }),
                taxCode: faker.random.alphaNumeric(10, { casing: 'upper' }),
                manager: faker.name.firstName(),
                regionCode: faker.random.alpha({ count: 2, casing: 'upper' }),
                regionName: faker.address.cityName(),
                sellingRegion: faker.address.cityName(),
                serviceRegion: faker.address.cityName()
            };
        });
        return res(
            ctx.status(200),
            ctx.json({
                d: {
                    __count: MAX_DATA,
                    results: dealers.splice($skip, $top)
                }
            }),
        );
    }
};