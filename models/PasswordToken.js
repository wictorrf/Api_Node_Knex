const knex = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class PasswordToken{
    async findByEmail(email){
        try {
            const result = await knex.select(["id", "name", "password", "email", "role"]).table("users").where({email: email});
            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    async create(email){
        let userFounded = await this.findByEmail(email);
        if (userFounded != undefined) {
            try {
                let token = uuidv4();
                await knex.insert({user_id: userFounded.id, used: 0, token: token}).table("passwordtokens");
                return {status: true, token: token};
            } catch (error) {
                console.log(error);
                return {status: false, err: error};
            }
        } else {
            return {status: false, err: "O email passado não existe no banco de dados!"}
        }
    }
    async validate(token){
        try {
            let result = await knex.select().table("passwordtokens").where({token: token});
            if (result.length > 0) {
                let tk = result[0];
                if(tk.used){
                    return {status: false};
                }else{
                    return {status: true, token: tk};
                }
            } else {
                return {status: false};
            }
        } catch (error) {
            console.log(error);
            return {status: false};
        }
    }
    async setUsed(token){
        await knex.update({used: 1}).table("passwordtokens").where({token: token});
    }

}

module.exports = new PasswordToken();