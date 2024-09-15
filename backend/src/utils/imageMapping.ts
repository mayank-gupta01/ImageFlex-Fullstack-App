class ImageMapping {
    private static instance: ImageMapping;
    private imageMap: Map<string, string>;
  
    private constructor() {
      this.imageMap = new Map();
    }
  
    public static getInstance(): ImageMapping {
      if (!ImageMapping.instance) {
        ImageMapping.instance = new ImageMapping();
      }
      return ImageMapping.instance;
    }
  
    public addMapping(originalPath: string, compressFilePath: string) {
      this.imageMap.set(originalPath, compressFilePath);
    }
  
    public getCompressPath(originalPath: string): string | undefined {
      return this.imageMap.get(originalPath);
    }
    
    public removeMapping(originalPath: string) {
      this.imageMap.delete(originalPath);
    }
  }
  
  // Export the singleton instance
  export const imageMapObj = ImageMapping.getInstance();
  