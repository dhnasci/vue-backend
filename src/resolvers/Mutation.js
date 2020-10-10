const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const { getUserId } = require('./../utils')

const JWT_SECRET = process.env.JWT_SECRET

function criaCliente (_, args, ctx, info) {
  const userId = getUserId(ctx)
  return ctx.db.mutation.createCliente( { 
    data:{
      ...args, 
      usuarioId: userId
    }
  }, info)
  
}

function criaReceitaMensal (_, { descricao, entrada, valor, idCliente }, ctx, info){

  const date = moment(args.entrada)
  if (!date.isValid){
    throw new Error('Entrada não é data válida!')
  }
  
  return ctx.db.mutation.createReceita({
    data: {
      descricao,
      entrada,
      valor,
      tipo: MENSALIDADE,
      quantidade: 1,
      cliente: {
        connect: {
          id: idCliente
        }
      }
    } 
  } ,info)

}

function criaCategoria (_, { descricao }, ctx, info){
  const userId = getUserId(ctx)
  return ctx.db.mutation.createCategoria({ 
    data: {
      descricao
    }

  }, info)
}

async function login (_, {email, password}, ctx, info) {

  const user = await ctx.db.query.user( { where: { email }})
  if (!user){
    throw new Error('Credencial de usuário inválida!')
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid){
    throw new Error('Senha inválida!')
  }

  const token = jwt.sign( {userId: user.id}, JWT_SECRET, { expiresIn: '2h'}  )

  return {
    token,
    user
  }
}

async function signup (_, args, ctx, info) {

  const password = await bcrypt.hash(args.password, 10)
    
  const user = await ctx.db.mutation.createUser({ data: { ...args, password } })

  const token = jwt.sign( {userId: user.id}, JWT_SECRET, { expiresIn: '2h'}  )

  return {
    token,
    user
  }
}

module.exports = {
  criaCliente,
  criaReceitaMensal,
  criaCategoria,
  signup, 
  login
}