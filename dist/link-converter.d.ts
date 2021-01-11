export default function (urls: string[]): Promise<({
    src: string;
    local: string;
} | undefined)[]>[];
