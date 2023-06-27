const UserModel = require("../models/UserModel")
const PasswordToken = require("../models/PasswordToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let secret = "sadlbewjhverfewjs";

class UserController{
    async create(req, res){
        let {name, email, password} = req.body;
        if(!email || !password || email == '' || email == ' '){
            return res.status(400).json({error : "Campos nao inseridos!"});
        }
        let emailExist = await UserModel.findEmail(email);
        if (emailExist) {
            return res.status(406).json({error : "Email ja existente!"});
        } else {
            await UserModel.new(name, email, password);
            res.status(200);
            res.send("usuario cadastrado!");
        }
    }
    async selectAll(req, res){
        let users = await UserModel.findAll();
        return res.status(200).json(users);
    }
    async selectOne(req, res){
        const id = req.params.id;
        let user = await UserModel.findById(id);
        if(user == undefined){
            return res.status(404).json({erro : "Usuario nao encontrado!"});
        }else{
            return res.status(200).json(user);
        }
    }
    async update(req, res){
        try {
            let {id, name, email, role} = req.body;
            const result = await UserModel.update(id, name, email, role);
            if(result){
                if(result.status){
                    return res.status(200).json("Atualização concluida!");
                }else{
                    return res.status(406).json(result.err);
                }
            }
        } catch (error) {
            return res.status(404).json({erro : "Ocorreu um erro no servidor!"});
        }
    }
    async delete(req, res){
            let id = req.params.id
            let result = await UserModel.delete(id);
            if(result && result.status == true){
                return res.status(200).json("Usuario deletado com sucesso!");
            }else{
                return res.status(406).send(result && result.error);
            }
    }
    async recoverPassword(req, res){
        let email = req.body.email;
        let result = await PasswordToken.create(email);
        if (result.status) {
            return res.status(200).json({token: result.token});
        } else {
            return res.status(406).send(result.err);
        }''
    }
    async changePassword(req, res){
        let token = req.body.token;
        let password = req.body.password;

        const isTokenValid = await PasswordToken.validate(token);
        if (isTokenValid.status) {
            await UserModel.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            return res.status(200).send("SENHA ALTERADA COM SUCESSO!");
        } else {
            return res.status(406).json("Token invalido!");
        }
    }
    async login(req, res){
        let {email, password} = req.body;
        let user = await PasswordToken.findByEmail(email);
        if (user != undefined) {
            let result = await bcrypt.compare(password, user.password);
            if(result){
                let token = jwt.sign({ email: user.email, role: user.role }, secret);
                return res.status(200).json({token: token, user: user.name});
            }else{
                return res.status(406).json("Email ou senha incorretas!");
            }
        } else {
            return res.status(406).json("Erro no servidor!");
        }
    }
    async validate(req, res){
        res.send("ok!")
    }
}
module.exports = new UserController();