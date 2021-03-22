import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ImageType, ResizeImage } from '@src/utils/ResizeImage';

@observer
export class Home extends React.Component {
  @observable private imageType = ImageType.SUB_BAGE;

  public render() {
    return (
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexWrap: 'wrap' }}
      >
        <div style={{ marginRight: '50px' }}>
          <Radio.Group value={this.imageType} onChange={this.changeType}>
            <Radio.Button value={ImageType.SUB_BAGE}>Сабки</Radio.Button>
            <Radio.Button value={ImageType.EMOTE}>Эмотки</Radio.Button>
          </Radio.Group>
        </div>
        <div>
          <input id="files" type="file" multiple={true} onChange={this.onChange} />
        </div>
      </div>
    );
  }

  private onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    Array.from(event.target.files).forEach(async (file: File) => {
      const resizeImage = new ResizeImage(file, this.imageType);
      const name = resizeImage.getName;
      const size = resizeImage.getSize;

      resizeImage.downloadBlob(`${name}_300.png`, await resizeImage.highSize());
      resizeImage.downloadBlob(`${name}_${size.medium}.png`, await resizeImage.mediumSize());
      resizeImage.downloadBlob(`${name}_${size.small}.png`, await resizeImage.smallSize());
      resizeImage.downloadBlob(`${name}_${size.verySmall}.png`, await resizeImage.verySmallSize());
    });
  };

  private changeType = (e: RadioChangeEvent) => {
    this.imageType = e.target.value;
  };
}
