import { Injectable } from '@nestjs/common';
import { OpenLibraryClient } from 'openbook.js';

@Injectable()
export class OpenbookService {
  private readonly openbookClient = new OpenLibraryClient('spellbound');

  async search(filters: {
    q: string;
    language?: string;
    limit?: number;
    page?: number;
  }) {
    return await this.openbookClient.search(filters);
  }

  async getWork(openlibrary_id: string) {
    return await this.openbookClient.getWork(openlibrary_id);
  }

  async getAuthor(openlibrary_id: string) {
    return await this.openbookClient.getAuthor(openlibrary_id);
  }

  async getWorksOfAuthor(openlibrary_id: string, limit?: number, offset?: number) {
    return await this.openbookClient.getAuthorWorks(openlibrary_id, { limit, offset });
  }
}
