import Resizer from 'react-image-file-resizer';

export enum ImageType {
  SUB_BAGE,
  EMOTE,
}

export class ResizeImage {
  private file: File;
  private type = ImageType.SUB_BAGE;

  constructor(file: File, type: ImageType) {
    this.file = file;
    this.type = type;
  }

  public maxSize = async () => {
    return await this.resizeFile(this.file, 1000);
  };

  public highSize = async () => {
    const maxSize = await this.maxSize();
    const highSize = await this.resizeFile(maxSize, 300);

    return highSize;
  };

  public goodSize = async () => {
    const maxSize = await this.maxSize();
    const goodSize = await this.resizeFile(maxSize, 150);

    return goodSize;
  };

  public mediumSize = async () => {
    const highSize = await this.goodSize();
    const mediumSize = await this.resizeFile(highSize, this.getSize.medium);

    return mediumSize;
  };

  public smallSize = async () => {
    const mediumSize = await this.mediumSize();
    const smallSize = await this.resizeFile(mediumSize, this.getSize.small);

    return smallSize;
  };

  public verySmallSize = async () => {
    const smallSize = await this.smallSize();
    const verySmallSize = await this.resizeFile(smallSize, this.getSize.verySmall);

    return verySmallSize;
  };

  private resizeFile(file: Blob, size: number): Promise<Blob> {
    return new Promise(resolve => {
      Resizer.imageFileResizer(
        file,
        size,
        size,
        'PNG',
        100,
        0,
        (uri: Blob) => {
          resolve(uri);
        },
        'file'
      );
    });
  }

  public downloadBlob(fileName: string, blob: Blob): void {
    if (!window.navigator.msSaveOrOpenBlob) {
      const anchor = window.document.createElement('a');
      anchor.href = window.URL.createObjectURL(blob);
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(anchor.href);
    } else {
      window.navigator.msSaveBlob(blob, fileName);
    }
  }

  public get getName() {
    return this.file.name.replace('.png', '');
  }

  public get getSize() {
    switch (this.type) {
      case ImageType.SUB_BAGE:
        return {
          medium: 72,
          small: 36,
          verySmall: 18,
        };
      case ImageType.EMOTE:
        return {
          medium: 112,
          small: 56,
          verySmall: 28,
        };
    }
  }
}
