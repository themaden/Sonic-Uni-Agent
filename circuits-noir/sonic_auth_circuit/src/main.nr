// SENIOR NOTE: This circuit proves knowledge of a private biometric key
// that corresponds to a public voice hash, without revealing the key itself.
// Uses Pedersen Hash for efficient ZK-proof generation.

use dep::std;

fn main (
     
     // Public Inputs
    voice_hash_public: pub Field,
    
    // Private Inputs
    biometric_private_key: Field,
    salt: Field,
) {

    // 1. Compute the hash of the private data securely inside the circuit.
    // The outside world cannot see 'biometric_private_key' or 'salt'.
    let computed_hash = std::hash::pedersen_hash([biometric_private_key, salt]);

    // 2. Constraint: The computed hash MUST match the public voice hash.
    // If someone tries to fake the proof without the private key, this assertion fails.
    assert(computed_hash == voice_hash_public);

    // Senior Log: Circuit constraint satisfied. Proof is valid.
    std::println("ZK-Proof Generated: Voice matches biometric signature.");
}