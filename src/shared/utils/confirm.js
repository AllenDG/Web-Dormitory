import Swal from 'sweetalert2';
import { primaryColorHex, errorColorHex } from '../theme/theme';

/**
 * Shared SweetAlert2 confirmation dialog, themed to match the app.
 * Replaces ad hoc Chakra Modal confirmations for simple yes/no actions.
 *
 * Not a form library — a confirmation with a *required* text input (e.g.
 * reject-with-reason) stays a Chakra Modal/SidePanel instead.
 *
 * @returns {Promise<boolean>} true if confirmed
 */
export async function confirmAction({
  title,
  text,
  icon = 'warning',
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  isDestructive = false,
}) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: isDestructive ? errorColorHex : primaryColorHex,
    cancelButtonColor: '#a0aec0',
    reverseButtons: true,
    focusCancel: isDestructive,
  });
  return result.isConfirmed;
}

export default confirmAction;
