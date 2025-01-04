import {
  ContactCreate,
  ContactRepository,
} from '../interfaces/contact.interface'
import { UserRepository } from '../interfaces/user.interface'
import { ContactRepositoryPrisma } from '../repositories/contact.repository'
import { UserRepositoryPrisma } from '../repositories/user.repository'

class ContactUseCase {
  private contactRepository: ContactRepository
  private userRepository: UserRepository

  constructor() {
    this.contactRepository = new ContactRepositoryPrisma()
    this.userRepository = new UserRepositoryPrisma()
  }

  async create({ email, name, phone, userEmail }: ContactCreate) {
    // email do usuario autenticado
    // buscar o usuario pelo email, se não existir, retornar erro. Se existir, cria o contato. Antes de criar o contato, verificar se o contato já existe pelo phone ou email.

    const user = await this.userRepository.findByEmail(userEmail)
    if (!user) throw new Error('User not found')

    const verifyIfExistsContact =
      await this.contactRepository.findByEmailOrPhone(email, phone)
    if (verifyIfExistsContact) throw new Error('Contact already exists')

    const contact = await this.contactRepository.create({
      email,
      name,
      phone,
      userId: user.id,
    })

    return contact
  }
}

export { ContactUseCase }
