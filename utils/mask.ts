export const maskToDate = (dateParam: string) => {
    const date = dateParam.replaceAll(/\D/g, '').slice(0, 8);
    if (date.length < 3) {
        return date;
    } else if (date.length < 5) {
        return `${date.slice(0, 2)}/${date.slice(2)}`;
    }
    return `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4)}`;
}

export const maskToCpf = (cpfParam: string) => {
    const cpf = cpfParam.replaceAll(/\D/g, '').slice(0, 11);
    if (cpf.length < 4) {
        return cpf;
    } else if (cpf.length < 7) {
        return `${cpf.slice(0, 3)}.${cpf.slice(3)}`
    } else if (cpf.length < 10) {
        return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    }
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`
}


export const phoneMask = (phone: string) => {
    return phone.replace(/\D/g, '') // Remove caracteres não numéricos
        .replace(/(\d{2})(\d)/, '($1) $2') // Aplica o DDD
        .replace(/(\d{5})(\d)/, '$1-$2') // Aplica o traço
        .replace(/(-\d{4})\d+?$/, '$1'); // Remove o que excede 11 caracteres
}

export const maxLengthNumbers = (value: string, maxLength: number) => {
    // Remove tudo que não for número e limita o tamanho da string para maxLength
    return value.replace(/\D/g, '').slice(0, maxLength);
}