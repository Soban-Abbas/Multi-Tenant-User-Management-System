const { emit } = require("cluster");
const employeeModel = require("./employeeModel")
const { pool } = require("../database/pool")
const crypto = require("crypto");
const { is_active } = require("../helpers/is_active");
exports.regNewCompany = async (name, email, password) => {
    try {
        const company_code = crypto.randomBytes(4).toString('hex');
        const regNewCompany = pool.query(`insert into companies (name , email , password , total_employees, company_code )
            values ($1,$2,$3,$4,$5) returning *`, [name, email, password, 0, company_code])
        return regNewCompany
    } catch (error) {
        throw (error)
    }
}
exports.findCompanyByEmail = async (email) => {
    try {
        const companyExist = await pool.query('select * from companies where email=$1 ', [email])
        if (companyExist.rowCount > 0) {
            return companyExist.rows[0]
        } else {
            throw new Error("wrong Email or password")
        }
    } catch (error) {
        error.status = 401
        throw error
    }
}

exports.increaseEmployeeCountByOne = async (id) => {
    try {
        await pool.query(`update companies 
        set total_employees = total_employees +1 where id = $1`, [id])
    } catch (error) {
        throw error
    }
}

exports.recoverEmployeeAccount = async (company_id, email, password) => {
    try {
        const employeeDetails = await employeeModel.verifyEmailAndPassword(email, password);
        if (company_id !== employeeDetails.company_id) {
            const error = new Error("This Employee is not associated with your company")
            error.status = 401;
            throw error;
            return
        }
        if (employeeDetails.is_active === true) {
            const error = new Error("This Employee is already active")
            error.status = 409;
            throw error;
            return
        }


        const activateAccount = await pool.query("update employees set is_active=true where id=$1 returning *", [employeeDetails.id])

        const { id, name, email:Employee_Email, is_active: activation } = activateAccount.rows[0];
        return {
            id,
            name,
            Employee_Email,
            activation
        }



    } catch (error) {
        throw error
    }
}

exports.getAllEmployeesthroughSearch=async(company_id,name)=>{
    try {
        const employees=await pool.query(`select id,name,email,role from employees where company_id=$1 AND name ilike '%'|| $2 || '%' `,[company_id,name])
        return employees
    } catch (error) {
        throw error
    }
}

exports.getAllEmployees=async(company_id)=>{
    try {
        const employees=await pool.query('select id,name,email,role,is_active from employees where company_id =$1 ',[company_id]);
        return employees
    } catch (error) {
     throw error   
    }
}