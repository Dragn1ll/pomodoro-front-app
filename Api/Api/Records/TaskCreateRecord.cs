namespace Api.Records;

public record TaskCreateRecord(
    string Name,
    string Description,
    DateTime AddedAt,
    DateTime StartedAt,
    bool Completed,
    int TimeSpent
    );