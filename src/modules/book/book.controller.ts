import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../role/decorators/role.decorator';
import { BookService } from './book.service';
import { ReadBookDTO } from './dto/read-book.dto';
import { RoleType } from '../role/role.types.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';
import { CreateBookDTO } from './dto';
import { GetUser } from '../auth/user.decorator';
import { UpdateBookDTO } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly _bookService: BookService) {}

  @Get(':id')
  getBook(@Param('id', ParseIntPipe) id: number): Promise<ReadBookDTO> {
    return this._bookService.get(id);
  }

  @Get('author/:authorId')
  getBooksByAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
  ): Promise<ReadBookDTO[]> {
    return this._bookService.getBookByAuthor(authorId);
  }

  @Get()
  getBooks(): Promise<ReadBookDTO[]> {
    return this._bookService.getAll();
  }

  @Post()
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBook(@Body() book: Partial<CreateBookDTO>): Promise<ReadBookDTO> {
    return this._bookService.create(book);
  }

  @Post()
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBookByAuthor(
    @Body() book: Partial<CreateBookDTO>,
    @GetUser('id') authorId: number,
  ): Promise<ReadBookDTO> {
    return this._bookService.createByAuthor(book, authorId);
  }

  @Patch(':id')
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() book: Partial<UpdateBookDTO>,
    @GetUser('id') authorId: number,
  ): Promise<ReadBookDTO> {
    return this._bookService.update(id, book, authorId);
  }

  @Delete(':id')
  deleteBook(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this._bookService.delete(id);
  }
}
