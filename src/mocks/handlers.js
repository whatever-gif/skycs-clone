import {rest} from 'msw';
import {faker} from '@faker-js/faker';
import dealersHandler from './dealers';
import provinceHandler from './province';

const MAX_DATA = 2000;
export const handlers = [
    // Handles a POST /login request
    rest.post('/login', null),
    // Handles a GET /user request
    rest.get('/user', null),
    rest.get('/city', (req, res, ctx) => {
        const data = Array(MAX_DATA).fill(0).map(() => {
            return {
                id: faker.datatype.uuid(),
                cityCode: faker.random.alpha({casing: 'upper', count: 2}),
                cityName: faker.address.cityName(),
            };
        });
        return res(
            ctx.status(200),
            ctx.json({
                d: {
                    __count: MAX_DATA,
                    results: data
                }
            }),
        );
    }),
    rest.get('api/Account/GetMyNetworks', (req, res, ctx) => {
        return {
            status: 200,
            body: {
                Success: true,
                Data: [
                    {
                        "ParentId": 0,
                        "Id": 7140169001,
                        "Name": "CÔNG TY CỔ PHẦN LIÊN DOANH Ô TÔ HYUNDAI THÀNH CÔNG VIỆT NAM",
                        "ShortName": "CÔNG TY CỔ PHẦN LIÊN DOANH Ô TÔ HYUNDAI THÀNH CÔNG VIỆT NAM",
                        "BizType": {
                            "Id": 0,
                            "Name": "BizType_0"
                        },
                        "BizField": {
                            "Id": 2,
                            "Name": "BizField_2"
                        },
                        "OrgSize": 0,
                        "OrgType": {
                            "Id": 0,
                            "OrgId": 0,
                            "Name": "OrgType_0",
                            "Description": null
                        },
                        "ContactName": "NGUYỄN ANH TÚ",
                        "Email": "2700919392@inos.vn",
                        "PhoneNo": null,
                        "Description": null,
                        "Enable": true,
                        "UserList": null,
                        "InviteList": null,
                        "CurrentUserRole": 3
                    },
                    {
                        "ParentId": 0,
                        "Id": 7140169001,
                        "Name": "CÔNG TY CỔ PHẦN LIÊN DOANH Ô TÔ HYUNDAI THÀNH CÔNG VIỆT NAM",
                        "ShortName": "CÔNG TY CỔ PHẦN LIÊN DOANH Ô TÔ HYUNDAI THÀNH CÔNG VIỆT NAM",
                        "BizType": {
                            "Id": 0,
                            "Name": "BizType_0"
                        },
                        "BizField": {
                            "Id": 2,
                            "Name": "BizField_2"
                        },
                        "OrgSize": 0,
                        "OrgType": {
                            "Id": 0,
                            "OrgId": 0,
                            "Name": "OrgType_0",
                            "Description": null
                        },
                        "ContactName": "NGUYỄN ANH TÚ",
                        "Email": "2700919392@inos.vn",
                        "PhoneNo": null,
                        "Description": null,
                        "Enable": true,
                        "UserList": null,
                        "InviteList": null,
                        "CurrentUserRole": 3
                    }
                ]
            }
        }
    }),
    rest.get('/provinces', provinceHandler.Mst_Province_Search),
    rest.patch("/provinces\\(:id\\)", provinceHandler.Mst_Province_Update),
    rest.post("/provinces", provinceHandler.Mst_Province_Create),
    rest.delete("/provinces\\(:id\\)", provinceHandler.Mst_Province_Delete),

    rest.get('/dealers', dealersHandler.getAllDealers),
    rest.patch("/dealers\\(:id\\)", dealersHandler.Mst_Dealer_Update),
    rest.post("/dealers", dealersHandler.createDealer),
    rest.delete("/dealers\\(:id\\)", dealersHandler.Mst_Dealer_Delete),
    rest.get('/odata/priorities', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                d: [

                    {name: 'High', value: 4},
                    {name: 'Urgent', value: 3},
                    {name: 'Normal', value: 2},
                    {name: 'Low', value: 1}
                ]
            })
        );
    }),
    rest.get('/odata/staffs', (req, res, ctx) => {
        const {url} = req;
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
        const staffs = Array(MAX_DATA).fill(0).map(() => {
            const data = {
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                email: faker.internet.email(),
                region: faker.address.city(),
                country: faker.address.country(),
                amount: faker.datatype.number(),
                date: faker.datatype.datetime(),
                priority: faker.datatype.number({min: 1, max: 4})
            };
            return data;
        });
        return res(
            ctx.status(200),
            ctx.json({
                d: {
                    __count: MAX_DATA,
                    results: staffs
                }
            }),
        );
    })
];