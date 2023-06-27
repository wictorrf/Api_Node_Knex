const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const passwordToken = require('./PasswordToken');

class UserModel{
    async findAll(){
        try {
            let result = await knex.select(["id", "name", "email", "role"]).table("users");
            return result;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    async findById(id){
        try {
            const result = await knex.select(["id", "name", "email", "role"]).table("users").where({id: id});
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
    async new(name, email, password){
        try {
            let hash = await bcrypt.hash(password, 10);
            await knex.insert({name, email, password: hash, role: 0}).table("users");
        } catch (error) {
            console.log(error);
        }
    }
    async findEmail(email){
        try {
            let result = await knex.select("*").from("users").where({email: email});
             if (result.length > 0) {
                return true;
             } else {
                return false;
             }
        } catch (error) {
            console.log(error);
        }
    }
    async update(id, name, email, role) {
        let user = await this.findById(id);
        if (user != undefined) {
          const editUser = new Map();
          if (name != undefined) {
            editUser.set('name', name);
          }
          if (email != undefined) {
            if (email != user.email) {
              let result = await this.findEmail(email);
              if (result == false) {
                editUser.set('email', email);
              } else {
                return { status: false, err: "O email ja está cadastrado!" };
              }
            }
          }
          if (role != undefined) {
            editUser.set('role', role);
          }
          const editUserObj = Object.fromEntries(editUser);
            try {
              await knex.update(editUserObj).where({ id: id }).table("users");
              return { status: true };
            } catch (error) {
              return { status: false, err: error };
            }
        } else {
          return { status: false, err: "O usuario nao existe!" };
        }
      }
      async delete(id){
        let user = await this.findById(id);
            if(user != undefined){
              try {
                await knex.delete().table("users").where({id: id});
                return {status: true};
              } catch (error) {
                return {status: false, error: error};
              }
            } else {
              return {status: false, error: "Usuário não existente e não pode ser deletado."};
            }
    }
  async changePassword(newPassword, id, token){
    try {
      let hash = await bcrypt.hash(newPassword, 10);
      await knex.update({password: hash}).table("users").where({id: id});
      await passwordToken.setUsed(token);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new UserModel();