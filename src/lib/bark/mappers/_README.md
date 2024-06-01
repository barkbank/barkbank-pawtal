# Mapper Functions

In general, mappers convert one type to another.
This abstraction is used for translating between encrypted and plaintext models.

## Naming Convention

The convention is to name these mapper functions by the destination type.

    async function toDestinationType(
        context: BarkContext,
        source: SourceType
    ): Promise<DestinationType>

This reads better where the functions are used because, at where the functions are called, the source type is typically known.

    const encryptedReport = await selectReport(...);
    const report = await toReport(context, encryptedReport);
