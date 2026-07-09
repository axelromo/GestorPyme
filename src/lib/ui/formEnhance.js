/**
 * Crea un callback use:enhance que evita doble envío y muestra estado de carga.
 * @param {() => boolean} estaEnviando
 * @param {(valor: boolean) => void} establecerEnviando
 */
export function crearEnhanceEnvio(estaEnviando, establecerEnviando) {
	return ({ cancel }) => {
		if (estaEnviando()) {
			cancel();
			return;
		}

		establecerEnviando(true);

		return async ({ update }) => {
			try {
				await update();
			} finally {
				establecerEnviando(false);
			}
		};
	};
}
