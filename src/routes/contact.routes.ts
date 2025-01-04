import { FastifyInstance } from 'fastify'
import { ContactUseCase } from '../usecases/contact.usecase'
import { ContactCreate } from '../interfaces/contact.interface'
import { authMiddleware } from '../middlewares/auth.middleware'

export async function contactRoutes(fastify: FastifyInstance) {
  const contactUseCase = new ContactUseCase()

  fastify.addHook('preHandler', authMiddleware) // todas rotas de contacts, antes de serem chamadas, passam por esse middleware de autenticação

  fastify.post<{ Body: ContactCreate }>('/', async (req, reply) => {
    const { name, email, phone } = req.body

    const emailUser: string = req.headers['email']

    try {
      const data = await contactUseCase.create({
        name,
        email,
        phone,
        userEmail: emailUser,
      })

      return reply.send(data)
    } catch (error) {
      reply.send(error)
    }
  })
}
