/// @title Sonic Agent Gateway Module
/// @notice This module handles cross-chain intent declarations for voice-activated transactions
/// @dev Registers user intents on-chain and emits events for backend processing
/// @author Sonic Uni-Agent Team
/// @custom:project HackMoney 2026 - Sonic Uni-Agent
module sonic_agent::gateway {
    

    use sui::tx_context::{Self, TxContext};
    use sui::event;

    // -----------------------------------------------------------------------
    // ERRORS
    // -----------------------------------------------------------------------
    /// @notice Error code for zero amount validation
    /// @dev Prevents declaring intents with zero value
    const EAmountZero: u64 = 0;

    // -----------------------------------------------------------------------
    // EVENTS
    // -----------------------------------------------------------------------
    /// @notice Emitted when a user declares a cross-chain intent
    /// @param user The address of the user declaring the intent
    /// @param amount The amount to be transferred
    /// @param target_chain The destination chain ID
    /// @param intent_hash Hash of the voice command for verification
    struct CrossChainIntent has copy, drop {
        user: address,
        amount: u64,
        target_chain: u64,
        intent_hash: vector<u8>
    }

    // -----------------------------------------------------------------------
    // ENTRY FUNCTIONS
    // -----------------------------------------------------------------------

    /// @notice Declares a cross-chain intent for voice-activated transactions
    /// @dev Emits a CrossChainIntent event that backend systems listen to
    /// @param amount The amount of tokens to transfer (must be > 0)
    /// @param target_chain The destination chain ID (1 for Ethereum, etc.)
    /// @param intent_hash Hash of the voice command for authentication
    /// @param ctx Transaction context
    /// @custom:emits CrossChainIntent
    public entry fun declare_intent(
        amount: u64,
        target_chain: u64,
        intent_hash: vector<u8>,
        ctx: &mut TxContext
    ) {
        // Validate amount is positive
        assert!(amount > 0, EAmountZero);

        // Emit event for backend processing
        event::emit(CrossChainIntent {
            user: tx_context::sender(ctx),
            amount,
            target_chain,
            intent_hash
        });
    }

    // -----------------------------------------------------------------------
    // INITIALIZATION
    // -----------------------------------------------------------------------
    
    /// @notice Module initialization function
    /// @dev Called when module is published, can set up initial state
    /// @param _ctx Transaction context
    fun init(_ctx: &mut TxContext) {
        // Module initialization logic if needed
    }
}