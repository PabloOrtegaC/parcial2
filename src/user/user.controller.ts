import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body() createUserDto: { name: string; email: string; password: string },
  ): { id: number; name: string; email: string; password: string } {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): { id: number; name: string; email: string; password: string }[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ): { id: number; name: string; email: string; password: string } | undefined {
    return this.userService.findOne(Number(id));
  }

  @Delete(':id')
  delete(@Param('id') id: string): boolean {
    return this.userService.delete(Number(id));
  }
}
