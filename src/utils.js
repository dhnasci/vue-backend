const jwt = require('jsonwebtoken')

function getUserId(context) {

  // usando o express para requisição http
  // "Authorization" : "Bearer <token_jwt>"
  const Authorization = context.request.get('Authorization');
  if (Authorization){
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    return userId
  }

  throw new Error('Usuário não autenticado!')
}

module.exports = {
  getUserId
}