const { getUserId } = require('./../utils')

function categorias (_, args, ctx, info){
  return ctx.db.query.categorias( {
    where: {
      OR: [ { descricao_starts_with: "Lim"},
    { descricao_starts_with: "Esc"} ]
    }
  } , info  )
}
function user (_, args, ctx, info){
  const userId = getUserId(ctx)
   return ctx.db.query.user({where: {id: userId }}, info)
}

module.exports = {
  categorias,
  user
}