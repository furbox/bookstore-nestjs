import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from './book.repository';
import { UserRepository } from '../user/user.repository';
import { status } from 'src/shared/entity.status.enum';
import { ReadBookDTO } from './dto/read-book.dto';
import { plainToClass } from 'class-transformer';
import { Book } from './book.entity';
import { In } from 'typeorm';
import { CreateBookDTO } from './dto';
import { User } from '../user/user.entity';
import { RoleType } from '../role/role.types.enum';
import { Role } from '../role/role.entity';
import { UnauthorizedException } from '@nestjs/common';
import { UpdateBookDTO } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private readonly _bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async get(bookId: number): Promise<ReadBookDTO> {
    if (bookId) {
      throw new BadRequestException('bookId must be send');
    }

    const book: Book = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    });

    if (!book) {
      throw new NotFoundException('book does not exist');
    }

    return plainToClass(ReadBookDTO, book);
  }

  async getAll(): Promise<ReadBookDTO[]> {
    const books: Book[] = await this._bookRepository.find({
      where: { status: status.ACTIVE },
    });

    return books.map((book) => plainToClass(ReadBookDTO, book));
  }

  async getBookByAuthor(authorId: number): Promise<ReadBookDTO[]> {
    if (!authorId) {
      throw new BadRequestException('id must be send');
    }

    const books: Book[] = await this._bookRepository.find({
      where: { status: status.ACTIVE, authors: In([authorId]) },
    });

    return books.map((book) => plainToClass(ReadBookDTO, book));
  }

  async create(book: Partial<CreateBookDTO>): Promise<ReadBookDTO> {
    const authors: User[] = [];

    for (const authorId of book.authors) {
      const authorExist = await this._userRepository.findOne(authorId, {
        where: { status: status.ACTIVE },
      });

      if (!authorExist) {
        throw new NotFoundException(
          `There's not an author with Id: ${authorId}`,
        );
      }

      const isAuthor = authorExist.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      );

      if (isAuthor) {
        throw new UnauthorizedException(
          `This user ${authorId} is not an Author`,
        );
      }

      authors.push(authorExist);
    }

    const saveBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      authors,
    });

    return plainToClass(ReadBookDTO, saveBook);
  }

  async createByAuthor(book: Partial<CreateBookDTO>, authorId: number) {
    const author = await this._userRepository.findOne(authorId, {
      where: { status: status.ACTIVE },
    });

    const isAuthor = author.roles.some(
      (role: Role) => role.name === RoleType.AUTHOR,
    );

    if (!isAuthor) {
      throw new UnauthorizedException(`This user ${authorId} is not an author`);
    }

    const saveBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      author,
    });

    return plainToClass(ReadBookDTO, saveBook);
  }

  async update(
    bookId: number,
    book: Partial<UpdateBookDTO>,
    authorId: number,
  ): Promise<ReadBookDTO> {
    const bookExists = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    });

    if (!bookExists) {
      throw new NotFoundException('This book does not exists');
    }

    const isOwnBook = bookExists.authors.some(
      (author) => author.id === authorId,
    );

    if (!isOwnBook) {
      throw new UnauthorizedException(`This user isn't the book's author`);
    }

    const updateBook = await this._bookRepository.update(bookId, book);
    return plainToClass(ReadBookDTO, updateBook);
  }

  async delete(id: number): Promise<void> {
    const bookExists = await this._bookRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!bookExists) {
      throw new NotFoundException('This book does not exist');
    }

    await this._bookRepository.update(id, { status: status.INACTIVE });
  }
}
