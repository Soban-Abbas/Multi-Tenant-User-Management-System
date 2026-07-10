const { pool } = require("./pool")
const queries = [`create table if not exists companies
                (
                id Serial primary Key,
                name character varying(20) not null,
                email character varying(40) not null,
                password text not null,
                total_employees integer default 0
                )`,
                `create table if not exists employees
                (
                id Serial primary Key,
                name character varying(20) not null,
                email character varying(40) not null,
                password text not null,
                department character varying(20) default null,
                role character varying(20) default null,
                company character varying(20) not null,
                company_id integer not null,
                       CONSTRAINT fk_company_employee
                        FOREIGN KEY(company_id)
                         REFERENCES companies(id),
                is_active boolean default true
                )`
]
exports.createTables = async () => {
    try {
await Promise.all(queries.map(q=>pool.query(q)))
    } catch (error) {
        throw error
    }
}