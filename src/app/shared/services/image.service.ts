import { Observable, Observer } from "rxjs";

export class ImageService {
    getBase64ImageFromURL(url: string) {
        return Observable.create((observer: Observer<string>) => {
            // create an image object
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            if (!img.complete) {
                // This will call another method that will create image from url
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
        // We create a HTML canvas object that will create a 2d image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        // This will draw image    
        ctx.drawImage(img, 0, 0);
        // Convert the drawn image to Data URL
        const dataURL = canvas.toDataURL('mage/png');
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
    }
}
