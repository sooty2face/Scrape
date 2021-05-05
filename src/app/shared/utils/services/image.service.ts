import { Observable, Observer } from 'rxjs';

export class ImageService {
    getBase64ImageFromURL$(url: string) {
        // tslint:disable-next-line: deprecation
        return new Observable((observer: Observer<string>) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            // console.log('image src ----- ' + img.src);
            if (!img.complete) {
                img.onload = () => {
                    observer.next(this.getBase64Image(img));
                    observer.complete();
                };
                img.onerror = (err) => {
                    observer.error(err);
                };
            } else {
                observer.next(this.getBase64Image(img));
                observer.complete();
            }
        });
    }

    getBase64Image(img: HTMLImageElement) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');

        return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
    }
}
