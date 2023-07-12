# Funcionalidades Extras
Coisas que não necessariamente fazem parte da aplicação, mas são dignas de notas:

## padStart:
Essa função faz basicamente o contrário do **trim**, em casos em que queremos sempre representar uma string com uma quantidade definida de caracteres, mas o valor da string em si não possui esse tanto de caracteres, podemos usar o **pad**, com o Start ou End, para complementar ela. 

Vamos usar isso para demonstrar nossos valores de tempo: quando os minutos ou segundos forem menores do que 10, os calculos que definimos vão nos retornar os números com apenas um dígito, e o ideia seria mostrar no crônometro 2 dígitos, ou seja, queremos mostrar '09', ao invés de somente 9. Para resolver isso, podemos usar o padStart da seguinte forma:

```js
    const minutes = String(minutesAmount).padStart(2, '0');
```

Ou seja, convertemos nosso valor numérico de minutos, que provém das contas que realizamos anteriormente, em uma String e, dentro da função padStart definimos que essa string deve ter 2 caractéres. Se ela não tiver, vamos colocar '0', no começo dela (à esquerda dela) até que ela tenha os 2 caracteres.