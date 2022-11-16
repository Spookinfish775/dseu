import { IChapterNumber } from '~/infrastructure/interfaces/IChapterNumber';

export class ChapterNumber implements IChapterNumber {
  bookChapterId: number
  numberFrom: number
  numberTo: number
  constructor(payload?: IChapterNumber) {
    this.bookChapterId = payload?.bookChapterId || null
    this.numberFrom = payload?.numberFrom || null
    this.numberTo = payload?.numberTo || null
  }
}