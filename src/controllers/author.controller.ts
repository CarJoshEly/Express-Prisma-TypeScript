import HttpStatusCode from '../utils/HttpStatusCode';
import * as AuthorService from '../services/author.service';
import { NextFunction, Request, Response } from 'express';
import { authorSchema } from '../types/zod';
import { TAuthorWrite } from '../types/general';
import { sendNotFoundResponse, sendSuccessNoDataResponse, sendSuccessResponse, sendConflictResponse } from '../utils/responseHandler';

export const listAuthors = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const authors = await AuthorService.listAuthors();
    return sendSuccessResponse(response, authors);
  } catch (error: any) {
    next(error);
  }
};

export const getAuthor = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = parseInt(request.params.id, 10);
    const author = await AuthorService.getAuthor(id);
    return sendSuccessResponse(response, author);
  } catch (error: any) {
    next(error);
  }
};

export const createAuthor = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const author: TAuthorWrite = request.body;
    const newAuthor = await AuthorService.createAuthor(author);
    return sendSuccessResponse(response, newAuthor, HttpStatusCode.CREATED);
  } catch (error: any) {
    next(error);
  }
};

export const updateAuthor = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = parseInt(request.params.id, 10);
    const author: TAuthorWrite = request.body;
    const updatedAuthor = await AuthorService.updateAuthor(author, id);
    return sendSuccessResponse(response, updatedAuthor);
  } catch (error: any) {
    next(error);
  }
};

export const deleteAuthor = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = parseInt(request.params.id, 10);
    await AuthorService.deleteAuthor(id);
    return sendSuccessNoDataResponse(response, 'Author has been deleted');
  } catch (error: any) {
    next(error);
  }
};

export const checkExistingAuthor = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = parseInt(request.params.id, 10);
    const author = await AuthorService.getAuthor(id);
    if (!author) {
      return sendNotFoundResponse(response, 'Author Not Found');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const validateAuthorData = (request: Request, response: Response, next: NextFunction) => {
  try {
    const author = request.body;
    authorSchema.parse(author);
    next();
  } catch (error) {
    next(error);
  }
};

export const checkDuplicateAuthor = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { firstName, lastName } = request.body;
    const existingAuthor = await AuthorService.findAuthorByName(firstName, lastName);

    // En PUT, params.id existe (el propio autor). En POST, no existe ninguno.
    const currentId = request.params.id ? parseInt(request.params.id, 10) : null;

    if (existingAuthor && existingAuthor.id !== currentId) {
      return sendConflictResponse(response, `Ya existe un autor llamado "${firstName} ${lastName}"`);
    }

    next();
  } catch (error) {
    next(error);
  }
};